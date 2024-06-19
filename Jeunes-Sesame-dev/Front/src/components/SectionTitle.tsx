import React from 'react';


const SectionTitle = (props : any) => {
    return (
        <>
            <h2 className="section-titre" style={{color: "#34495e"}}>  
                {props.text} 
                <hr style={{width: "20%", marginTop: 10,  border: "1px solid #16a084"}}/>
            </h2>
        </>
    )
}


export default SectionTitle;