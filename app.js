'use strict'

// Requiring the 'dotenv' npm package
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

const phrases = [
  " I think you mean 'definitely'",
  " Do you mean 'definitely'?",
  " You probably meant 'definitely'",
  " Did you mean to say 'definitely'?"
]

const Twitter = new TwitterPackage(keys)

// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: 'defiantly'}, function (stream) {
  // ... when we get tweet data...
  stream.on('data', function (tweet) {
    // the if statement will ignore retweets of tweets with our tracked string/hashtag
    if (!tweet.retweeted_status) {
    // print out the text of the tweet that came in
      console.log(tweet.text)
      // getting the id of the Tweet to reply to
      let nameId = tweet.id_str
      // getting the twitter handle of the user to reply to
      let name = tweet.user.screen_name
      // calculate the random index
      let randomIndex = Math.round(Math.random() * phrases.length)
      // build the reply
      let statusObj = '@' + name + phrases[randomIndex]
      // params are what define the reply. status gets statusObj which is the reply to the user
      // in_reply_to_status_id: nameID is saying we are replying to this tweet with an id of `nameID`
      let params = {
        status: statusObj,
        in_reply_to_status_id: nameId
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
