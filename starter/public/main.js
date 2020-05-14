const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
    fetch('/todoitems', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            // item that you want to update items: items
        })
    })
    .then(res => {
        if(res.ok) {
            return res.json()
        }
    })
    .then(response => {
        window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
    fetch('/todoitems', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            //item: item name you want to delete
        })
    })
    .then(res => {
        if(res.ok) {
            return res.json()
        }
    }).then(response => {
            if(response === 'deleted the selected item') {
                messageDiv.textContent = 'Nothing to delete'
            } else {
                window.location.reload(true)
            }
    })
    .catch(console.error)
})