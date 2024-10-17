import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 0,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 0,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriends, setSelectedFriends] = useState(null);

  function handleAdd() {
    setShowAdd((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAdd(false);
  }

  function handleSelectedFriends(friend) {
    setSelectedFriends((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAdd(false);
  }

  function handleSplitBill(value){
    setFriends(friends=>friends.map(friend=>friend.id === selectedFriends.id ? {...friend , balance : friend.balance + value} : friend))

    setSelectedFriends(null);

  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriends={selectedFriends}
          onSelectedFriend={handleSelectedFriends}
        />

        {showAdd && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleAdd}>{showAdd ? "Close" : "Add Friend"}</Button>
      </div>
      {selectedFriends && <FormSplitBill selectedFriends={selectedFriends} onSplitBill={handleSplitBill}/>}
    </div>
  );
}

function FriendList({ friends, onSelectedFriend, selectedFriends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectedFriend={onSelectedFriend}
          selectedFriends={selectedFriends}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriends }) {
  const isSelected =  selectedFriends?.id  === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe  {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {" "}
          {friend.name} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and your {friend.name} are equal</p>}
      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setFriendName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setFriendName(e.target.value)}
      />

      <label>📷 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriends , onSplitBill }) {
  const [bill ,setPaidBill] = useState("");
  const [paidbyuser , setPaidByUser] = useState("");
  const [whoispaying , setWhoispaying] = useState("user")
  const ispaid = bill ? bill - paidbyuser : ""; 

  function handleSubmit(e){
    e.preventDefault();

    if(!bill || !paidbyuser) return;
    onSplitBill(whoispaying === "user" ? ispaid : -paidbyuser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name}</h2>

      <label>💵Bill expense</label>
      <input type="text" value={bill} onChange={e=>setPaidBill(Number(e.target.value))}/>

      <label>🙎‍♂️Your expense</label>
      <input type="text"  value={paidbyuser} onChange={e=>setPaidByUser(Number(e.target.value) > bill ? paidbyuser : Number(e.target.value))}/>

      <label>🧑‍🤝‍🧑{selectedFriends.name} expense</label>
      <input type="text" value={ispaid}/>

      <label>🏧Whos gonna pay the bill</label>
      <select value={whoispaying} onChange={e=>setWhoispaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>

      <Button>SplitBill</Button>
    </form>
  );
}
