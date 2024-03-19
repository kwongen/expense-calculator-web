import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

import { useAuthContext } from "../../context/AuthContext"
import { getFriendsApi, deactivateFriendApi } from "../../api/FriendApi"
import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import YesNoModal from "../../component/YesNoModal";
import MessageModal from "../../component/MessageModal";
import FriendCard from "./component/FriendCard";
import FriendAddModal from "./FriendAddModal";
import FriendEditModal from "./FriendEditModal"

function FriendList () {
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);
    const [friends, setFriends] = useState([]);
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [yesNoModalConfig, setYesNoModalConfig] = useState({show:false, heading:"", body:""});
    const { userProfile } = useAuthContext();

    useEffect( () => {    
        setAlertConfig({show:false, heading:"", body:""})
        fetchFriendsData();
    }, []);
    
    const fetchFriendsData = (async () => {   
        const response = await getFriendsApi(userProfile);

        if( response.error ) {
            setAlertConfig({show:true, heading:"Failed to load your friends:", body: response.error})
        } else {
            setFriends(response)
        }
    });

    const closeAddFriendModal = () => {
        setAddFriendModalShow(false);
        fetchFriendsData();
    }

    const [editFriendModalShow, setEditFriendModalShow] = useState(false);
    const [editFriend, setEditFriend] = useState({});
    const [editFriendOrig, setEditFriendOrig] = useState({});

    const openEditFriendModal = (id) => {
        const friend = friends.find(item => item._id == id)
        const cloneFriend = JSON.parse(JSON.stringify(friend));
        setEditFriend(friend);
        setEditFriendOrig(cloneFriend);
        setEditFriendModalShow(true);
    }

    const closeEditFriendModal = () => {
        setEditFriendModalShow(false);
        setEditFriend({});
        setEditFriendOrig({});
        fetchFriendsData();
    }

    const [deleteFriendId, setDeleteFriendId] = useState();
    const [msgModalConfig, setMsgModalConfig] = useState({show:false, heading:"", body:""});

    const deleteFriend = (friend) => {
        setDeleteFriendId(friend._id)
        setYesNoModalConfig({show:true, heading:"Confirm", body:`Do you want to delete "${friend.name}" friend?`})
    }

    const confirmDelete = async () => {
        const friend = friends.find((f) => f._id === deleteFriendId)

        setYesNoModalConfig({show:false, heading:"", body:""})

        try {
            const result = await deactivateFriendApi(userProfile, deleteFriendId)

            if(result === "success") {
                setMsgModalConfig({show:true, heading:"Delete", body:`This friend "${friend.name}" has deleted.`})
            
                if(editFriendModalShow)
                    setEditFriendModalShow(false)

                fetchFriendsData();
            } else {
                setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this friend "${friend.name}": ${result.error}`})               
            }
        } catch (error) {
            setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this friend "${friend.name}": ${error.message}`})
        }
    }

    return (
        <>
        <MessageModal modalConfig={msgModalConfig} 
                    handleModalClose={() => setMsgModalConfig({show:false, heading:"", body:""})} />
        <YesNoModal modalConfig={yesNoModalConfig}
                    handleYes={confirmDelete}
                    handleNo={() => setYesNoModalConfig({show:false, heading:"", body:""})} />
        <FriendEditModal show={editFriendModalShow} 
                        friend={editFriend}
                        friendOrig={editFriendOrig}
                        onHide={closeEditFriendModal} 
                        onChange={setEditFriend} 
                        onDelete={deleteFriend} />
        <SiteLayout>
            <div className="flex-container card-deck protest-riot-regular-lg">
               Your friends &amp; family
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <div key="friendContainer" className="flex-container card-deck">
                {friends.length === 0 && "Please add your friends..."}
                {friends.length>0 && friends.map( (friend, index) => 
                    <FriendCard key={friends._id} 
                                friend={friend} 
                                openEditFriendModal={openEditFriendModal}
                                onDelete={deleteFriend} />
                )}
            </div>         
            <div className="py-3 d-grid gap-2">
                <Button variant="success" size="lg" onClick={() => setAddFriendModalShow(true)}>Add Friend or Family</Button>
            </div>
            <FriendAddModal
                show={addFriendModalShow}
                onHide={closeAddFriendModal}
            />
        </SiteLayout>
        </>
    )
}

export default FriendList;
