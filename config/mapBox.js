const geocodingConfigMapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = geocodingConfigMapbox({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

module.exports.getGeoCodeData = async function (placeName){
    const data = await geocodingClient.forwardGeocode({
                      query: placeName,
                      limit: 1
                    }).send()
          return data;
}

