function checkUserData() {
    let storedResult = {}
    const storedResultRaw = sessionStorage.getItem('storedResult');
    if (storedResultRaw) {
        storedResult = JSON.parse(storedResultRaw);
    } else {
        location.href = 'index.html';
    }

    if (!storedResult.name || !storedResult.lastName || !storedResult.email ) {
        location.href = 'index.html';
    }
    return storedResult;
}