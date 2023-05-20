import React from "react"
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"

function Overlay({ loading }) {
    return loading ? (
        <>
        <div className="app__overlay app__overlay--light">
            <ClimbingBoxLoader loading={loading} color="hsl(26, 100%, 55%)" size={"40px"} />
        </div>
        <h2 style={{marginTop: "100px",  }}>Getting you a Custom NFT</h2>
        <p style={{textAlign: "center"}}>If you have come here from my linkedin post <br />
        then please upload your nft Screenshot in the comments 😃</p>
        </>
    ) : null
}

export default Overlay
