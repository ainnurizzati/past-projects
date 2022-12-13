const TelegramBot = require('node-telegram-bot-api');
const token = '1922509082:AAHAd5Qhm5Pdy8k3YaUOaN0oX3Sc2xQjQo0';
const bot = new TelegramBot(token, {polling: true});

//Start message
bot.on('message', (msg) => {

    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id,"Hello dear user");
    }

    var bye = "bye";
    if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
    }

    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) ===0){
        bot.sendMessage(msg.from.id, "Hello" + msg.from.first_name);
    }

});

//Weather command
const axios = require('axios');
//OpenWeatherMap API key
const appID = '1534fe794e6e8cd346728ce7e4d9ca65';

// OpenWeatherMap endpoint for getting weather by city name
const weatherEndpoint = (city) => (
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`
);

// URL that provides icon according to the weather
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds, rain) => (
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`
);

//TAK FAHAM = NANTI GOOGLE TENTANG AXIOS LAGI 
// Function that gets the weather by the city name
const getWeather = (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  axios.get(endpoint).then((resp) => {
    const {
      name,
      main,
      weather,
      wind,
      clouds
    } = resp.data;

    bot.sendPhoto(chatId, weatherIcon(weather[0].icon))
    bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
        parse_mode: "HTML"
      }
    );
  }, error => {
    console.log("error", error);
    bot.sendMessage(
      chatId,
      `Ooops...I couldn't be able to get weather for <b>${city}</b>`, {
        parse_mode: "HTML"
      }
    );
  });
}

// Listener (handler) for telegram's /weather event
bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(
      chatId,
      `Please provide city name with /weather 'cityname'`
    );
    return;
  }
  getWeather(chatId, city);
});

