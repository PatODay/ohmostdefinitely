'use strict'

require('dotenv').load()
// Requiring twitter package
const TwitterPackage = require('twitter')
// Creating a JS object containing keys/tokens associated with this account
const keys = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

// console.log(process.env);

const Twitter = new TwitterPackage(keys)

// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: 'defiantly'}, function (stream) {
  // ... when we get tweet data...
  stream.on('data', function (tweet) {
    if (!tweet.retweeted_status) {
    // print out the text of the tweet that came in
      console.log(tweet.text)
      let nameID = tweet.id_str
      let name = tweet.user.screen_name
      // build the reply object
      let statusObj = '@' + name + " I think you mean 'definitely'"
      let params = {
        status: statusObj,
        in_reply_to_status_id: nameID
      }
      // call the post function to tweet something
      Twitter.post('statuses/update', params, function (error, tweetReply, response) {
      // if we get an error print it out
        if (error) {
          console.log(error)
        }

        // print the text of the tweet we sent out
        console.log(tweetReply.text)
      })
    }
  })

  // ... when we get an error...
  stream.on('error', function (error) {
    // print out the error
    console.log(error)
  })
})
