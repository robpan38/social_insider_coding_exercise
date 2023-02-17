const PORT = process.env.PORT | 3500;
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();

const { getTotalPropertyPerProfile } = require("./utils");

const SOCIAL_INSIDER_API_URL = "https://app.socialinsider.io/api";
const SOCIAL_INSIDER_API_TOKEN = "API_KEY_TEST";
const SOCIAL_INSIDER_PROJECT_NAME = "API_test";
const SOCIAL_INSIDER_HEADERS = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SOCIAL_INSIDER_API_TOKEN}`
    }
};
const SOCIAL_INSIDER_GET_BRANDS_REQUEST = {
    "jsonrpc": "2.0",
    "id": 0,
    "method": "socialinsider_api.get_brands",
    "params": {
        "projectname": SOCIAL_INSIDER_PROJECT_NAME
    }
};
const SOCIAL_INSIDER_GET_PROFILE_DATA_REQUEST = {
    ...SOCIAL_INSIDER_GET_BRANDS_REQUEST,
    "method": "socialinsider_api.get_profile_data",
    "params": {}
};

app.use(express.json());
app.use(cors());

app.post('/get_brand_data', async (req, res) => {
    const ceva = await axios.post(
        SOCIAL_INSIDER_API_URL,
        SOCIAL_INSIDER_GET_BRANDS_REQUEST,
        SOCIAL_INSIDER_HEADERS
    );

    let brands = [...ceva.data.result];
    let brands_profile_data = await Promise.all(
        brands.map(brand => {
            return Promise.all(
                brand.profiles.map(profile => {
                    return axios.post(
                        SOCIAL_INSIDER_API_URL,
                        {
                            ...SOCIAL_INSIDER_GET_PROFILE_DATA_REQUEST,
                            "params": {
                                "id": profile.id,
                                "profile_type": profile.profile_type,
                                "date": {
                                    "start": req.body.date.start,
                                    "end": req.body.date.end,
                                    "timezone": req.body.date.timezone
                                }
                            }
                        },
                        SOCIAL_INSIDER_HEADERS
                    )
                })
            )
        })
    )

    brands_profile_data = brands_profile_data.map(brand_data => {
        return brand_data.map(brand_profile_data => brand_profile_data.data.resp)
    });
    brands_profile_data_keys = brands_profile_data.map(brand_data => {
        return brand_data.map(brand_profile_data => Object.keys(brand_profile_data)[0])
    })

    let result = [];
    // for each brand
    for (let i = 0; i < brands_profile_data_keys.length; i++) {
        // for each profile
        let brand_results = {
            brandname: brands[i].brandname,
            profiles: brands_profile_data_keys[i].length,
            totalFans: 0,
            totalEngagement: 0
        };

        for (let j = 0; j < brands_profile_data_keys[i].length; j++) {
            brand_results.totalFans += getTotalPropertyPerProfile(brands_profile_data[i][j][brands_profile_data_keys[i][j]], 'followers');
            brand_results.totalEngagement += getTotalPropertyPerProfile(brands_profile_data[i][j][brands_profile_data_keys[i][j]], 'engagement');
        }

        result.push(brand_results);
    }

    res.send(result);
})

app.listen(PORT, () => {
    console.log("listening on port 3500!");
})