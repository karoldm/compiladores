import { useState, useEffect } from 'react';
import styled from "styled-components";
import FirstTab from "../AllTabs/FirstTab";
import SecondTab from "../AllTabs/SecondTab";

const Erros = styled.p`
  width: 100%;
  font-size: 1rem;
  color: rgb(200, 50, 50);;
  padding: 0.3rem;
  font-style: bold;
`;

const Tabs1 = styled.div`
    width: 100%;
    height: auto;
    min-height: 300px;
    border: 2px solid rgba(200, 50, 50, .5);;
    padding: 1rem;
    margin: 0.1rem;
    color: rgb(200, 50, 50);;
`;

const Nav = styled.ul`  
    width: 30%;
    display: flex;
    align-items: center;   
    font-size: 1rem;
  
    @media (max-width: 768px) {
      width: 90%;
    }
  `;

const Li = styled.li`  
    width: 40%;
    padding: 0.5rem;
    font-size: 0.9rem;
    list-style: none;
    text-align: center;
    cursor: pointer;
    transition: all 0.7s;
    border-radius: 2rem;
    &:hover, &:active{
    background: rgba(50, 224, 196, 0.15);
    background: rgba(173, 102, 102, 0.377);
    }
 
  `;

const Li2 = styled.li`
    width: 40%;
    padding: 0.5rem;
    font-size: 0.9rem;
    list-style: none;
    text-align: center;
    cursor: pointer;
    transition: all 0.7s;
    border-radius: 2rem;
    &:hover, &:active{
    background: rgba(50, 224, 196, 0.15);
    background: rgba(173, 102, 102, 0.377);
    }
  `;

const Tabs = ({setActiveTab, activeTab}: any) => {

    const handleTab1 = () => {
        setActiveTab("tab1");
    };

    const handleTab2 = () => {
        setActiveTab("tab2");
    };

    return (
        <>
        <Tabs1>
        <Erros>Erros</Erros>
            <Nav>
                <Li
                    className={activeTab === "tab1" ? "active" : ""}
                    onClick={handleTab1}
                >
                    Análise léxica
                </Li>
                <Li2
                    className={activeTab === "tab2" ? "active" : ""}
                    onClick={handleTab2}
                >
                    Análise sintática
                </Li2>
            </Nav>
            <div className="outlet">
                {activeTab === "tab1" ? <FirstTab /> : <SecondTab />}
            </div>
        </Tabs1>
        </>
    );
};

export default Tabs;