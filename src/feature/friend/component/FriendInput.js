import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { Trash3, PersonPlus } from "react-bootstrap-icons";


const FriendInput = ({index, inputFields, setInputFields}) => {
    const name = inputFields[index].name;
    const email = inputFields[index].email;
    const members = inputFields[index].members;

    //const [members, setMembers] = useState([{name:"", email:""}])

    const handleFriendChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;        
        setInputFields(data);
    }

    const removeFriend = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }

    const addMember = (index, event) => {
        let data = [...inputFields];
        data[index].members = [...data[index].members, {name:"", email:""}]
        setInputFields(data);
    }

    const handleMemberChange = (index, member_index,event) => {
        let data = [...inputFields];
        data[index].members[member_index][event.target.name] = event.target.value;        
        setInputFields(data);
    }

    const removeMember = (index, member_index) => {
        let data = [...inputFields];
        data[index].members.splice(member_index, 1);
        setInputFields(data)
    }

    return (
        <>
        <Row className="">
            <Col xs={12} lg={5} className="px-1">
                <FloatingLabel controlId="floatingName" label="Friend's name" className="mb-1">
                    <Form.Control key={"_name_" + index} placeholder="Friend's name" 
                                type="text"
                                name="name"
                                value={name} 
                                required
                                isValid={false}
                                onChange={event => handleFriendChange(index, event)} />
                </FloatingLabel>
            </Col>
            <Col xs={12} lg={6} className="px-1">
                <FloatingLabel controlId="floatingEmail" label="Friend's email  (optional)" className="mb-1">
                    <Form.Control key={"_email_"+index} placeholder="Friend's email (optional)" 
                                type="email"
                                name="email"
                                value={email} 
                                isValid={false}
                                onChange={event => handleFriendChange(index, event)} />
                </FloatingLabel>
            </Col>
            {(index > 0) &&  
            <Col xs={12} lg={1} className="pb-2 px-1">
                <Button variant="danger" style={{fontSize:"13px",width:"100%", height:"100%"}} 
                    onClick={() => removeFriend(index)}><Trash3 size={20}/></Button>
            </Col>
            }
        </Row>
        <Row className="pt-0">
            <Col xs={12} lg={1} className="pt-2"> 
                <Button variant="secondary" style={{fontSize:"13px",width:"100%"}}
                    onClick={event => addMember(index, event)}><PersonPlus size={20}/></Button>
            </Col>
            <Col xs={12} lg={11} className="pt-2">
                {members.map((item, member_index) => {
                    return(
                        <>
                        <Row className="pb-1">
                        <Col xs={12} lg={5} className="px-0 pb-2">
                        <Form.Control key={"_" + index + "_member" + member_index + "_name"} 
                                    placeholder="Member's name" 
                                    type="text"
                                    name="name" 
                                    value={item.name} 
                                    required
                                    isValid={false}
                                    onChange={event => handleMemberChange(index, member_index, event)}/>
                        </Col>
                        <Col xs={12} lg={6} className="px-0 pb-2">
                        <Form.Control key={"_"+ index + "_member" + member_index + "_email"} 
                                    placeholder="Member's email (optional)" 
                                    type="email"
                                    name="email"
                                    value={item.email} 
                                    isValid={false}
                                    onChange={event => handleMemberChange(index, member_index, event)}/>
                        </Col>
                        <Col xs={12} lg={1} className="px-1 pb-2">
                        <Button key={"_"+index+ "_member" + member_index + "_button"}
                            variant="secondary" className="w-100"
                            onClick={() => removeMember(index, member_index)}><Trash3 size={20}/></Button>
                        </Col>
                        </Row>
                        </>
                    )
                })}
            </Col>
        </Row>
        <Row className="pt-2"><hr /></Row>
        </>
    )
}

export default FriendInput;