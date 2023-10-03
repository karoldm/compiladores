import { useState, useEffect } from 'react';
import styled from "styled-components";


interface Props {
    errors: string[];
}


const FirstTab = (errors: any) => {
    return (
        <>
            <div className="FirstTab">
       {/* {errors.map(errors => <p>{errors.message}</p>)}
           {errors} */}
            </div>
        </>
    );
}


export default FirstTab;