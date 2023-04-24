import React from "react";
import ReactDOM from "react-dom";
import { GetServerSideProps } from 'next';
import {connectToDatabase} from '@/lib/db';
import 'bootstrap/dist/css/bootstrap.css';
import {Header} from "@/components/Header";
import {Chat} from "@/components/Chat";
import {SidebarHeader} from "@/components/SidebarHeader"
import styles from "./Doc.module.css";

//Props
interface DocProps {
    title: string;
}



export function Doc (props: DocProps) {

    //Hard-Coded Data. Change Later
    let headers = ["Header A", "Header B", "Header C", "Header D", "Header E", "Header F"];
    let bodies = [
        `Body A: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `,
        `Body B: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `,
        `Body C: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `,
        `Body D: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `,
        `Body E: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `,
        `Body F: 

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis condimentum sapien. Ut luctus posuere nunc. Praesent dictum quam consequat nunc vehicula, sit amet rhoncus augue sollicitudin. Curabitur vitae aliquet enim. Donec sit amet neque neque. Nullam ut luctus nisi, sed viverra enim. Aenean arcu turpis, gravida sed vehicula vel, vulputate quis purus. Proin euismod ligula non tincidunt ultrices. In scelerisque auctor lorem, iaculis gravida libero consequat sed. Maecenas ac augue efficitur felis pellentesque luctus in et neque. Vivamus molestie elit lorem, sed aliquet ipsum tincidunt et. Morbi hendrerit orci ut arcu vestibulum, ac iaculis velit porta. Curabitur at odio vitae elit porttitor tempor ac ac purus. Sed lacinia cursus elit, vitae pellentesque metus cursus ut. Etiam et ultricies lacus.
        
        Aliquam eleifend, mauris at consectetur tempor, est nisl mattis mi, et euismod nisi lacus mollis orci. Nam felis dolor, mollis molestie elit vel, venenatis pharetra velit. Duis viverra ex mi, vitae sagittis nibh auctor pharetra. Vestibulum sagittis elementum nisi in mollis. Maecenas semper diam vitae mauris sollicitudin, a volutpat neque tristique. Fusce blandit dolor vel quam pharetra congue. Nullam ornare augue ut metus ullamcorper convallis. Praesent lobortis posuere lacinia. Nam consectetur urna eu dui tincidunt, at tincidunt lacus dignissim. Nunc. `
    ];
    for(let i=0; i<20; i++){
        headers.push("Filler Header " + i);
        bodies.push("Filler Body " + i);
    }

    //Function for Dynamically Generating Contents
    const listSidebarHeaders = [];
    const listContent = [];
    for(let i=0; i<headers.length; i++){
        listSidebarHeaders.push(
            <a href={"#link-"+i} style={{textDecoration: 'none', scrollBehavior: 'smooth'}}>
            <SidebarHeader header={headers[i]} />
            </a>
        );
        listContent.push(
            <>
            <h1 id={"link-"+i} className={styles.header}>{headers[i]}</h1>
            <p id={"link-"+i} className={styles.body}>{bodies[i]}</p>
            </>
        );
    }

    return(
        <>
        <div className={styles.container}>
            <div className={styles.sidebar}>
                {listSidebarHeaders}
            </div>
            <div className={styles.content}>
                {listContent}
            </div>
        </div>
        <div className={styles.chat}>
                <Chat/>
        </div>
        </>
    );

}