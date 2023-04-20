import fitz
from operator import itemgetter
import openai
import time
from pymongo import MongoClient
import os
import re


def remove_tags(chunk):
  pattern = r'<\|\|\|[a-z0-9]*>'
  output_str = re.sub(pattern, '', chunk)
  # print("REGEX OUTPUT----------------------")
  # print(output_str)
  return output_str


def insert_into_db(acceptable_templates, outputs, doc_name, myHeader):
  db = get_database()
  # Insert collections
  print("Doc Name: ", doc_name[8:])
  collection_name = db[doc_name[8:]]
  print("size of acceptable_templates: ", len(acceptable_templates))
  print("size of outputs: ", len(outputs))
  # len of outputs should be 1
  for index, elem in enumerate(outputs):
    for j, chunk in enumerate(elem):
      header = chunk[1]
      print("HEADER-------------: ", header)
      print("Inserting Chunk---------------------------", j)
      # print(chunk[0])
      res = {
        "header" : header,
        "chunk" : chunk[0],
      }
      collection_name.insert_one(res)
  print("Inserted into collection")


def get_database():
  # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = os.environ['PYTHON_MONGO']

   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)

   # Create the database for our example (we will use the same database throughout the tutorial
   return client['LavaLabDB']



def fonts(doc, granularity=False):
    """Extracts fonts and their usage in PDF documents.
    :param doc: PDF document to iterate through
    :type doc: <class 'fitz.fitz.Document'>
    :param granularity: also use 'font', 'flags' and 'color' to discriminate text
    :type granularity: bool
    :rtype: [(font_size, count), (font_size, count}], dict
    :return: most used fonts sorted by count, font style information
    """
    styles = {}
    font_counts = {}

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:  # iterate through the text blocks
            if b['type'] == 0:  # block contains text
                for l in b["lines"]:  # iterate through the text lines
                    for s in l["spans"]:  # iterate through the text spans
                        if granularity:
                            identifier = "{0}_{1}_{2}_{3}".format(
                                s['size'], s['flags'], s['font'], s['color'])
                            styles[identifier] = {'size': s['size'], 'flags': s['flags'], 'font': s['font'],
                                                  'color': s['color']}
                        else:
                            identifier = "{0}".format(s['size'])
                            styles[identifier] = {
                                'size': s['size'], 'font': s['font']}

                        font_counts[identifier] = font_counts.get(
                            identifier, 0) + 1  # count the fonts usage

    font_counts = sorted(font_counts.items(), key=itemgetter(1), reverse=True)

    if len(font_counts) < 1:
        raise ValueError("Zero discriminating fonts found!")

    return font_counts, styles


def font_tags(font_counts, styles):
    """Returns dictionary with font sizes as keys and tags as value.
    :param font_counts: (font_size, count) for all fonts occuring in document
    :type font_counts: list
    :param styles: all styles found in the document
    :type styles: dict
    :rtype: dict
    :return: all element tags based on font-sizes
    """
    p_style = styles[font_counts[0][0]
                     ]  # get style for most used font by count (paragraph)
    p_size = p_style['size']  # get the paragraph's size

    # sorting the font sizes high to low, so that we can append the right integer to each tag
    font_sizes = []
    for (font_size, count) in font_counts:
        font_sizes.append(float(font_size))
    font_sizes.sort(reverse=True)

    # aggregating the tags for each font size
    idx = 0
    size_tag = {}
    for size in font_sizes:
        idx += 1
        if size == p_size:
            idx = 0
            size_tag[size] = '<|||p0>'
        if size > p_size:
            size_tag[size] = '<|||h{0}>'.format(idx)
        elif size < p_size:
            size_tag[size] = '<|||s{0}>'.format(idx)

    return size_tag


def headers_para(doc, size_tag, font_counts):
    """Scrapes headers & paragraphs from PDF and return texts with element tags.
    :param doc: PDF document to iterate through
    :type doc: <class 'fitz.fitz.Document'>
    :param size_tag: textual element tags for each size
    :type size_tag: dict
    :rtype: list
    :return: texts with pre-prended element tags
    """
    header_para = []  # list with headers and paragraphs
    first = True  # boolean operator for first header
    previous_s = {}  # previous span
    reduce_fonts = {}

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:  # iterate through the text blocks
            if b['type'] == 0:  # this block contains text

                # REMEMBER: multiple fonts and sizes are possible IN one block

                block_string = ""  # text found in block
                for l in b["lines"]:  # iterate through the text lines
                    for s in l["spans"]:  # iterate through the text spans
                        if s['text'].strip():  # removing whitespaces:
                            if first:
                                previous_s = s
                                first = False
                                block_string = size_tag[s['size']] + s['text']
                            else:
                                if s['size'] == previous_s['size']:
                                    if block_string and all((c == "|") for c in block_string):
                                        # block_string only contains pipes
                                        block_string = size_tag[s['size']
                                                                ] + s['text']
                                    elif block_string == "":
                                        # new block has started, so append size tag
                                        block_string = size_tag[s['size']
                                                                ] + s['text']
                                    else:  # in the same block, so concatenate strings
                                        block_string += " " + s['text']
                                        if (str(s['size']) in reduce_fonts):
                                            reduce_fonts[str(s['size'])] += 1
                                        else:
                                            reduce_fonts[str(s['size'])] = 1

                                else:
                                    header_para.append(block_string)
                                    block_string = size_tag[s['size']
                                                            ] + s['text']

                                previous_s = s

                    # new block started, indicating with a pipe
                    # block_string += "|"

                header_para.append(block_string)
    for index, elem in enumerate(font_counts):
        if (elem[0] in reduce_fonts):
            font_counts[index] = (font_counts[index][0],
                                  font_counts[index][1] - reduce_fonts[elem[0]])
    return header_para


def find_subheading(font_counts, size_tag):
    headers = []
    for font_size, count in font_counts:
        if ('h' in size_tag[float(font_size)]):
            headers.append((size_tag[float(font_size)], count))

    headers = sorted(headers, key=itemgetter(1), reverse=True)
    return headers


def grab_chunks(text_bodies, header, result, tag_index, myHeaders):
    spots = []
    for heading, index in tag_index:
        if (heading == header):
            spots.append(index)
    # spots = [0, 6, 20 ...] where spots[i] is an entry in result that starts with header
    i = 0
    for index, elem in enumerate(spots):
        if (index == (len(spots) - 1)):
            break
        first_index = elem
        second_index = spots[index+1]
        chunk = result[first_index: second_index]
        # concat
        chunk_string = ' '.join(map(str, chunk))
        # TODO parse out chunks of size less than 50words * 4 chars = 200 chars ?
        if (len(chunk_string) > 200):
            text_bodies.append(chunk_string)
            # Add header
            myHeaders.append(result[elem])
    last_chunk = result[spots[len(spots) - 1]:]
    last_chunk_string = ' '.join(map(str, last_chunk))
    myHeaders.append(result[spots[len(spots) - 1]])
    # May not want to include this string
    text_bodies.append(last_chunk_string)
    # print("TEXTBODIES----------------------")
    # print(text_bodies)



def send_prompts(acceptable_templates, headers_used, outputs, myHeaders, doc_name):
    db = get_database()
    collection_name = db[doc_name[8:]]
    st = time.time()

    for index, elem in enumerate(acceptable_templates):
        print("On header", headers_used[index])
        print("We have ", len(elem), "text chunks")
        print("Acceptable_templates len", len(acceptable_templates))
        print("Querying GPT")
        cur_output = []
        for i, chunk in enumerate(elem):
            # Remove all tags
            chunk = remove_tags(chunk)
            print("On Chunk", i, "-------------", len(elem), len(chunk))
            header = remove_tags(myHeaders[i])
            # token limit
            if (len(chunk) > (4097 - 1080)):
                for k in range(0, len(chunk), 4097-1080):
                    inference_not_done = True
                    # Catching exceptions (timeout, remote disconnection, bad gateway)
                    while (inference_not_done):
                        try:
                            prompt = "I will give you a page of hardware documentation from an electric engineering manual. I want you to make some new documentation inspired by software documentation's simple and relatively easy to read layout."
                            prompt += "\n" + chunk[k:min(len(chunk), k + (4097-1080))]
                            completion = openai.ChatCompletion.create(
                                model="gpt-3.5-turbo",
                                messages=[{"role": "user", "content": prompt}],
                                max_tokens=1024,
                                temperature=0.8)['choices'][0]['message']['content']
                            cur_output.append((completion, header))
                            # print("Cur_output--------------------------------")
                            # print(cur_output)
                            # insert into db
                            res = {
                                "header": header,
                                "chunk": completion,
                            }
                            collection_name.insert_one(res)
                            print("Inserted into collection")
                            inference_not_done = False
                        except Exception as e:
                            print(f"Waiting 5 minutes")
                            print(f"Error was: {e}")
                            time.sleep(300)
            else:
                inference_not_done = True
                # Catching exceptions (timeout, remote disconnection, bad gateway)
                while (inference_not_done):
                    try:
                        prompt = "I will give you a page of hardware documentation from an electric engineering manual. I want you to make some new documentation inspired by software documentation's simple and relatively easy to read layout."
                        prompt += "\n" + chunk
                        completion = openai.ChatCompletion.create(
                            model="gpt-3.5-turbo",
                            messages=[{"role": "user", "content": prompt}],
                            max_tokens=1024,
                            temperature=0.8)['choices'][0]['message']['content']
                        cur_output.append((completion,header))
                        # print("Cur_output--------------------------------")
                        # print(cur_output)
                        # insert into db
                        res = {
                            "header": header,
                            "chunk": completion,
                        }
                        collection_name.insert_one(res)
                        print("Inserted into collection")
                        inference_not_done = False
                        # print(completion)
                    except Exception as e:
                        print(f"Waiting 5 minutes")
                        print(f"Error was: {e}")
                        time.sleep(300)
        outputs.append(cur_output)
    et = time.time()
    elapsed_time = et - st
    print('Execution time:', elapsed_time, 'seconds')

def parse_documention(document):
    doc = fitz.open(document)
    font_counts, styles = fonts(doc, granularity=False)
    size_tag = font_tags(font_counts, styles)
    result = headers_para(doc, size_tag, font_counts)
    headers = find_subheading(font_counts, size_tag)
    print(headers)
    tag_index = []
    
    for index, chunk in enumerate(result):
        if (len(chunk) > 0):
            if chunk[0] == "<":
                tag_index.append((chunk[:chunk.find('>') + 1], index))

    page_count = len(doc)
    acceptable_templates = []

    # We can output based on <h5>, <h7> is the most popular <h346> are negligible, <h2> is nice
    headers_used = []
    # myHeaders holds headers for each chunk
    myHeaders = []

    print("PAGE COUNT", page_count)
    for header, count in headers:
        # accept headers if 10% of pages <= count <= 2 * pages
        # FIX: only accepting specific headers
        # count >= int(page_count/10) and count <= 1.5 * page_count range
        if (header == "<|||h3>"):
            text_bodies = []
            # grab chunks of text for page_count
            grab_chunks(text_bodies, header, result, tag_index, myHeaders)

            acceptable_templates.append(text_bodies)
            headers_used.append(header)

    print("Headers used:", headers_used)
    outputs = []
    
    # Retrieve GPT Outputs
    send_prompts(acceptable_templates, headers_used, outputs, myHeaders, document)
    # acceptable_templates holds lists of chunk strings for each header || outputs [html] for each acceptable template
    # insert_into_db(acceptable_templates, outputs, document, myHeaders)


parse_documention('../docs/Rigol.pdf')


# TODO store header page numbers?