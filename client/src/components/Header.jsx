import {ConnectButton} from "web3uikit"

const Header = () => {
    return ( 
        <nav>
                <ConnectButton moralisAuth={false}/>
        </nav>
     );
}
 
export default Header;