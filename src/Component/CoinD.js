import React from 'react'


const CoinD = (props) => {
    let {market_cap_change_percentage_24h} = props
    
    
  return (
    <div >
      <a href={`https://www.coingecko.com/en/coins/${props.id}`} style={{textDecoration:"none"}}>
      <div className='row d-flex flex-row '>

<div className="col-4 pe-5"style={{height:"50px",width:"50px"}}>
  <img src={props.image} alt="coin" style={{height:"50px",width:"50px"}}></img>
</div>

  <div className="col-4 ">
    
    
    <h5>{props.name} </h5>

   
    <p>mkt_cap  ${props.market_cap} </p>
     
  </div>
  <div className='col-4'>{market_cap_change_percentage_24h < 0 ?(<p style={{color:"red"}}> &#9660; {props.market_cap_change_percentage_24h}</p>):(<p style={{color:"green"}}>&#9650; {props.market_cap_change_percentage_24h}</p>)}</div>
  


</div>
      </a>
      
      
    </div>
  )
}

export default CoinD;
