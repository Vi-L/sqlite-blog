# hello-sqlite

Funny talk to check out: https://www.destroyallsoftware.com/talks/wat
- [Git and Github for Poets](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZF9C0YMKuns9sLDzK6zoi)
- https://git-man-page-generator.lokaltog.net/


## Next up tasks and features to work on
- Paginate results on each user's feed so only 10 posts are shown at a time. Could use infinite scrolling technique here or a query parameter like `feed/victor?page=1`. See https://stackoverflow.com/questions/51183321/how-to-use-paging-with-sqlite and https://stackoverflow.com/questions/14468586/efficient-paging-in-sqlite-with-millions-of-records/14468878
- display a loading spinner while loading
- Look into ensuring authentication before accessing New Post and redirecting the user to the login page if they aren't logged in.
- Show errors and/or redirect when users don't exist. Handle all other potential issues wth a `.catch` block and display a nice error message on screen.
- DB adjustments:
  - enforce usernames as unique
  - add post titles?
  - [CASCADE](https://www.techonthenet.com/sqlite/foreign_keys/foreign_delete.php)
- /post/:id route that shows one post for a user along with a front-end HTML page
- differentiate between a user feed with no posts and a feed of a user that doesn't exist
- Ability to search for users, posts, topics/tags?
- Could add comments and other features to this application once the above are complete
- Let logged in users delete and edit their own posts.

## Tables
- User
  - id auto-incrementing number
  - username string
    - how many characters? 20
    - what kind of characters? only alphanumeric
  - password string
    - how many characters? at least 8
    - what kind of characters? at least one capital/lowercase and one special character / number
  - email? string/varchar
    - might be tricky to validate (regex)
- Posts
  - id auto-incrementing number
  - likes: number
  - text 
  - time
  - foreign key userid number which points to an id in the User table, the author of the post
- Comments
  - id number
  - text string
  - time
  - foreign key userid to users
  - foreign key postid to posts
  - optional foreign key commentid -- if this is null, it's a comment on a post, otherwise it's a child comment
- Friends or followers/following?
- Avatars?

## Future things to do or look into
- Check out github--we can export this project there and see how it works
- Explore the Jekyll blog engine
- TypeScript
- Front-end frameworks
  - React
  - Angular
  - AngularJS
  - Vue
  - OR use vanilla JS and create your own [single page app](https://en.wikipedia.org/wiki/Single-page_application)
    - http://vanillaspa.glitch.me/
    - https://developer.mozilla.org/en-US/docs/Web/API/History
- Bundlers and transpilers: webpack, bower, babel, grunt, parcel, etc
- Check out windows subsystem for linux
- Feel free to play around with [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)

## Interesting fun/educational extra resources
- Bash environment variables: https://www.baeldung.com/linux/bashrc-vs-bash-profile-vs-profile
- [Understanding the event loop](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [What happens when you type google.com into a browser and press enter?](https://github.com/alex/what-happens-when)
- [Crash Course in Computer Science](https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo)
- [Michael Abrash](https://www.bluesnews.com/abrash/chap70.shtml) also [Fabien Sanglard](https://fabiensanglard.net/)
- [Flaschen Taschen](https://www.noisebridge.net/wiki/Flaschen_Taschen)

## Random AI stuff:
- https://stackoverflow.com/questions/10168686/image-processing-algorithm-improvement-for-coca-cola-can-recognition#10169025
- https://www.kaggle.com/
- https://pbs.twimg.com/media/CeW4xluUMAAiDWm.jpg
- https://unbabel.com/blog/wp-content/uploads/2018/05/image_preview-7.jpeg

### Binary/Hex stuff
There are 10 kinds of people in the world, those who understand binary and those who don't.
```
10
0 1 2 3 .. 9 10, 100, 1000, 10000

0  1 10 11  100  101  110  111  1000
0  1  2  3    4    5    6   7    8    9   10 
^  ^  ^       ^                  ^

2^0 2^1=2 2^2=4  2^3=8  2^4=16 ....

1010 + 11 = 1101
1010 & 11 = 0010

truth table for and:
A B result
------------
1 1 1
1 0 0
0 1 0
0 0 0

truth table for or:
A B result
------------
1 1 1
1 0 1
0 1 1
0 0 0

truth table for xor:
A B result
------------
1 1 0
1 0 1
0 1 1
0 0 0

"nand"

    1010
  &   11
  ------

1010 | 11 = 1011
1010 ^ 11 = 1001
10 ^ 10 = 0  <-- base 10
4 ^ 2   = 6  <-- base 10
100 ^ 10 = 110
~1010    = 101

(123).toString(2)   // <- converts number in base 10 to base N
parseInt("1001", 2) // <- converts number from baes N to base 10

0123456789abcdef <-- hex
```