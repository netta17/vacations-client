import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IVacation } from '../../Models/IVacation';
import { ActionType } from '../../redux/action-type';
import { AppState } from '../../redux/app-state';
import './FollowVacation.css'

export default function FollowVacation(props: IVacation) {

    let vacationsArray = useSelector((state: AppState) => state.vacationsArray)

    let dispatch = useDispatch();

    let onToggleFollow = (e: React.ChangeEvent<HTMLInputElement>) => {

        let vacationId = props.vacationId;
        if (e.target.checked) {
            axios.post("http://34.65.97.206:3001/followedVacations/", { vacationId })
                .then((response) => {
                    return
                })
                .catch(err => alert('Failed, please try again'));
        }
        else {
            axios.delete(`http://34.65.97.206:3001/followedVacations/${vacationId}`)
                .then((response) => {
                    return
                })
                .catch(err => alert('Failed, please try again'));
        }


        dispatch({ type: ActionType.ToggleFollowVacation, payload: { vacationId: props.vacationId, isFollowed: e.target.checked, vacationsArray } })
    }


    return (
        <label className="follow-me-label">
            {!props.isFollowed && <input type="checkbox" id="toggle" className="follow-me" onChange={onToggleFollow} checked={false} />}
            {props.isFollowed && <input type="checkbox" id="toggle" className="follow-me2" onChange={onToggleFollow} checked />}
            {props.isFollowed && <p>Unfollow Me</p>}
            {!props.isFollowed && <p>Follow Me</p>}
        </label>
    )
}