document.getElementById("openModalBtn").onclick = function () {
  document.getElementById("myModal").style.display = "flex";
};

document.getElementById("closeModalBtn").onclick = function () {
  document.getElementById("myModal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target == document.getElementById("myModal")) {
    document.getElementById("myModal").style.display = "none";
  }
};


const socket = io('http://localhost:3000');

document.getElementById('generateTokenBtn').addEventListener('click', async () => {
    const reason = document.getElementById('tokenInput').value;
    if (!reason) return alert('Please enter a reason');

    const response = await fetch('/chat/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
    });
    const result = await response.json();
    if (result.tokenId) {
        localStorage.setItem('tokenId', result.tokenId);
        showPendingSection();
    }
});

socket.on('token-updated', (data) => {
    const tokenId = localStorage.getItem('tokenId');
    if (data.token.tokenId === tokenId && data.token.status === 'accepted') {
        showChatSection();
    }
});

function showPendingSection() {
    document.querySelector('.generateTokenSection').style.display = 'none';
    document.querySelector('.pendingTokenSection').style.display = 'block';
}

function showChatSection() {
    document.querySelector('.pendingTokenSection').style.display = 'block';
    document.querySelector('.chatSection').style.display = 'block';
}

// document.getElementById('sendMessageBtn').addEventListener('click', async () => {
//     const tokenId = localStorage.getItem('tokenId');
//     const message = document.getElementById('chatInput').value;
//     if (!message) return;

//     await fetch('http://localhost:3000/api/send-message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ tokenId, sender: 'user', message }),
//     });
//     document.getElementById('chatInput').value = '';
// });
