document.addEventListener('DOMContentLoaded', () => {
    const urlShortenerForm = document.getElementById('url-shortener-form');
    const linkList = document.getElementById('link-list');

    urlShortenerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const longUrl = document.getElementById('long-url').value;
        const expirationTime = document.getElementById('expiration-time').value;

        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ longUrl, expirationTime }),
        });

        if (response.ok) {
            const data = await response.json();
            const shortLink = data.shortLink;

            // Add the new link to the list
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="short-link"><a href="/s/${shortLink}" style="text-decoration: underline; color: blue;">https://short.link/${shortLink}</a></span><i data-link="${shortLink}" class="far fa-trash-alt delete-icon"></i>`;
            linkList.appendChild(listItem);

            // Add event listener for the delete icon
            const deleteIcon = listItem.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', async () => {
                const linkToDelete = deleteIcon.getAttribute('data-link');
                const response = await fetch(`/delete/${linkToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    listItem.remove();
                } else {
                    alert('Failed to delete the link.');
                }
            });
        }
    });
});
