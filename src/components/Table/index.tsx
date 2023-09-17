import styled from "styled-components"
import { Columns, ITable } from "../../interfaces/table";

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
    columns: Columns[];
    datas: ITable[];
  }

export const Table = ({columns, datas}: Props) => {
    
    return(
       <Container>
         <Wrapper>
            <thead>
                <tr>
                    {columns.map(column => <th key={column}>{ column }</th>)}
                </tr>
            </thead>
            <tbody>
                {datas.map((data, index) =>
                    <tr key={index}>
                        {columns.map((column, index) => <td key={index}>{data[column]}</td>)}
                    </tr>
                )}
            </tbody>
        </Wrapper>
       </Container>
    );
}
