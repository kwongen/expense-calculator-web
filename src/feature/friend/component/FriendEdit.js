import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { Trash3, PersonPlus, BootstrapReboot } from "react-bootstrap-icons";


const FriendEdit = ({friend, setFriend}) => {
    const key = friend._id
    const name = friend.name;
    const email = friend.email;
    const isMyself = friend.isMyself;
    const members = friend.members;

    //const [members, setMembers] = useState([{name:"", email:""}])

    const handleFriendChange = (event) => {
        const _friend = {...friend}
        _friend[event.target.name] = event.target.value;        
        setFriend(_friend);
    }

    const addMember = () => {
        const _friend = {...friend}
        _friend.members = [..._friend.members, {name:"", email:"", active:true}]
        setFriend(_friend);
    }

    const handleMemberChange = (member_index,event) => {
        const _friend = {...friend}
        _friend.members[member_index][event.target.name] = event.target.value;        
        setFriend(_friend);
    }

    const removeMember = (member_index) => {
        const _friend = {...friend}

        if(_friend.members[member_index]._id) {
            const currentStatus = _friend.members[member_index].active;
            const isRemove = currentStatus;

            _friend.members[member_index].active = !currentStatus;

            const nameElement = document.getElementById("_member_" + member_index + "_name");
            const emailElement = document.getElementById("_member_" + member_index + "_email");
            const btnElement = document.getElementById("_member_" + member_index + "_button");
            const undoElement = document.getElementById("_member_" + member_index + "_undo");

            nameElement.disabled = isRemove ? true : false;
            nameElement.style.textDecoration = isRemove ? "line-through" : "none";
            emailElement.disabled = isRemove ? true : false;
            emailElement.style.textDecoration = isRemove ? "line-through" : "none";
            btnElement.style.display= isRemove ? "none" : "block";
            undoElement.style.display=isRemove ? "block" : "none";
        } else {
            _friend.members.splice(member_index, 1);
        }
        
        setFriend(_friend);
    }

    return (
        <>
        <Row className="">
            <Col xs={12} lg={6} className="px-1">
                <FloatingLabel controlId="floatingName" label="Friend's name" className="mb-1">
                    <Form.Control key={key+"_name"} placeholder="Friend's name" 
                                type="text"
                                name="name"
                                value={name} 
                                required
                                isValid={false}
                                disabled={isMyself}
                                onChange={event => handleFriendChange(event)} />
                </FloatingLabel>
            </Col>
            <Col xs={12} lg={6} className="px-1">
                <FloatingLabel controlId="floatingEmail" label="Friend's email  (optional)" className="mb-1">
                    <Form.Control key={key+"_email"} placeholder="Friend's email (optional)" 
                                type="email"
                                name="email"
                                value={email} 
                                isValid={false}
                                disabled={isMyself}
                                onChange={event => handleFriendChange(event)} />
                </FloatingLabel>
            </Col>
        </Row>
        <Row className="pt-0">
            <Col xs={12} lg={1} className="pt-2"> 
                <Button variant="secondary" style={{fontSize:"13px",width:"100%"}}
                    onClick={event => addMember(event)}><PersonPlus size={20}/></Button>
            </Col>
            <Col xs={12} lg={11} className="pt-2">
                {members && members.map((item, member_index) => {
                    return(
                        <Row key={`row_${member_index}`} className="pb-1">
                            <Col key={`col_1_${member_index}`}  xs={12} lg={5} className="px-0 pb-2">
                                <Form.Control key={key + "_member" + member_index + "_name"}
                                    id={"_member_" + member_index + "_name"}
                                    placeholder="Member's name"
                                    type="text"
                                    name="name"
                                    value={item.name}
                                    required
                                    isValid={false}
                                    disabled={!item.active}
                                    style={{ textDecoration: item.active ? 'none' : 'line-through' }}
                                    onChange={event => handleMemberChange(member_index, event)} />
                            </Col>
                            <Col key={`col_2_${member_index}`} xs={12} lg={6} className="px-0 pb-2">
                                <Form.Control key={key + "_member" + member_index + "_email"}
                                    id={"_member_" + member_index + "_email"}
                                    placeholder="Member's email (optional)"
                                    type="email"
                                    name="email"
                                    value={item.email}
                                    isValid={false}
                                    disabled={!item.active}
                                    style={{ textDecoration: item.active ? 'none' : 'line-through' }}
                                    onChange={event => handleMemberChange(member_index, event)} />
                            </Col>
                            <Col key={`col_3_${member_index}`}  xs={12} lg={1} className="px-1 pb-2">
                                <Button key={key + "_member" + member_index + "_undo"}
                                    id={"_member_" + member_index + "_undo"}
                                    variant="secondary" className="w-100"
                                    style={{ display: item.active ? 'none' : 'block' }}
                                    onClick={() => removeMember(member_index)}><BootstrapReboot size={20} /></Button>

                                <Button key={key + "_member" + member_index + "_button"}
                                    id={"_member_" + member_index + "_button"}
                                    variant="secondary" className="w-100"
                                    style={{ display: !item.active ? 'none' : 'block' }}
                                    onClick={() => removeMember(member_index)}><Trash3 size={20} /></Button>
                            </Col>
                        </Row>
                    )
                })}
            </Col>
        </Row>
        <Row className="pt-2"><hr /></Row>
        </>
    )
}

export default FriendEdit;