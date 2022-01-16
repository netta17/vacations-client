
import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import Reports from "../Reports/Reports";
import "./Header.css";


export default function Header() {

    let currentUser = useSelector((state: AppState) => state.currentUser)

    return (
        <div className="header">
            <h1 className="title">Fantasy vacations</h1>
            {currentUser.userType === "admin" &&
                <Reports />
            }
        </div>

    )
}