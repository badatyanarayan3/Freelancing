// Inside script.js
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.getElementById('tabs');
    tabs.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'A') {
            event.preventDefault();
            alert(`Switch to ${target.textContent} tab`);
        }
    });
});
 
