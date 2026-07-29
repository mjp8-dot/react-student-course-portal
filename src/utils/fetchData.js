export default function fetchData(username, itemName) {

    const users = JSON.parse(localStorage.getItem("Users")) || [];

    const currentUser = users.find(
        user => user.username === username
    );

    if (!currentUser) {
        return null;
    }

    return currentUser[itemName];
}