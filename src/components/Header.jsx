export default function Header(props) {

    return (
        <div className="header card">
        
            <div className="name">
                <h1>DIY Student Portal</h1>
            </div>

            <div className="date">
                <h2>{new Date().toLocaleDateString()}</h2>
            </div>

            <div className="profile">

                <div className="profilepic">
                    <img src="https://cdn-icons-png.flaticon.com/512/10542/10542459.png" height={50} width={50}/>
                </div>

                <div className="username">
                    <h3>{props.username}</h3>
                </div>

                {/* <button style = {{ border: "none", borderRadius: '20px', }} className="card">▼</button> */}

            </div>
        </div>
    )
}