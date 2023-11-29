import React from 'react';
import styled from "styled-components"

const Wrapper = styled.table`
    padding: 6px;
    border-radius: 8px;
    border-collapse: collapse;
    width: 100%;
    font-size: .8rem;
    overflow-y: scroll;

    tr:nth-child(even){background-color: #f2f2f2;}
    
    tr:hover {background-color: #ddd;}
    
    th, td {
        padding: 6px;
    }
    
    th {
        padding-top: 6px;
        padding-bottom: 6px;
        text-align: left;
        background-color: #04AA6D;
        color: white;
    }
`;

const Container = styled.div`
    overflow: auto;
    border: 1px solid rgba(0, 0, 0, 0.2);
`;

interface Props {
    columns: any[];
    datas: any;
  }

export const TableSemantic = ({columns, datas}: Props) => {

    return(
       <Container>
        {datas && <Wrapper>
            <thead>
                <tr>
                    {columns.map(column => <th key={column}>{ column }</th>)}
                </tr>
            </thead>
            <tbody>
                {Object.keys(datas).map((key, index) =>
                    <tr key={key}>
                        {columns.map((c, index) => {
                          if(c === "utilizada") {
                            return <td key={index}>{datas[key][c] ? "true" : "false"}</td>;
                          }
                          else {
                            return <td key={index}>{datas[key][c]}</td>;
                          }
                        })}
                    </tr>
                )}
            </tbody>
        </Wrapper>}
       </Container>
    );
}
