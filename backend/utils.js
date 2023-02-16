const getTotalPropertyPerProfile = (profile, property) => {
    let total = 0;
    
    for (let date in profile) {
        total += profile[date][property] ? profile[date][property] : 0;
    }

    return total;
}

const getTotalPropertyPerBrand = (brand, property) => {
    let total = 0;

    for (let profile in brand) {
        total += getTotalPropertyPerProfile(brand[profile], property);
    }

    return total;
}

module.exports = {
    getTotalPropertyPerBrand,
    getTotalPropertyPerProfile
}