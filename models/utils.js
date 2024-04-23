const findNextId = (data) => {
    let nextId = 0;
    for (const element of data) {
        if (element.id > nextId) {
            nextId = element.id;
        }
    }
    return nextId + 1;
};

const findIndex = (data, id) => {
    id = parseInt(id)
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.id === id) {
            return i;
        }
    }
    return null;
}

exports.findNextId = findNextId;
exports.findIndex = findIndex;
