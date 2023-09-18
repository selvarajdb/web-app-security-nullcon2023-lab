function fetchComments() {
    fetch(`${SERVER_PROTOCOL}//${SERVER_IP}:3000/comments`)
    .then(response => response.json())
    .then(comments => {
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.innerHTML = comment;
            commentsList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}