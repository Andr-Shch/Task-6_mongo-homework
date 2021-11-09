'use strict'

const {mapUser, getRandomFirstName,  mapArticle} = require('./util')

// db connection and settings
const connection = require('./config/connection')
let userCollection
let articleCollection
let studentCollection



run()

async function run() {
  await connection.connect()
 
   await connection.get().dropCollection('users')
   await connection.get().createCollection('users')
   userCollection = connection.get().collection('users')

   await connection.get().dropCollection('articles');
   await connection.get().createCollection('articles');
   articleCollection = connection.get().collection('articles');
  
   await connection.get().dropCollection('students');
   await connection.get().createCollection('students');
   studentCollection = connection.get().collection('students');
  
  await example1()
  await example2()
  await example3()
  await example4()

  await articlesTask1();
  await articlesTask2();
  await articlesTask3();
  await articlesTask4();
  await articlesTask5();
  
  await conectStudents()

  console.log('111');
  await connection.close()
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1() {

  try {
  const department = ['a', 'b', 'c']
  const users = department.map(dep=>[mapUser({department:dep}), mapUser({department:dep})]).flat()
  
  await userCollection.insertMany(users)

  } catch (err) {
    console.error(err)
  }
}

// - Delete 1 user from department (a)

async function example2() {
  try {
   
   const theOne = await userCollection.deleteOne({department:'a'})

  } catch (err) {
    console.error(err)
  }
}

// - Update firstName for users from department (b)

async function example3() {
  try {
    const usersB = await userCollection.find({department: 'b'}).toArray();
    const bulkWrite = usersB.map(user => ({
      updateOne: {
        filter: {_id: user._id},
        update: {$set: {firstName: getRandomFirstName()}}
      }
    }));

    const {result} = await userCollection.bulkWrite(bulkWrite);

  } catch (err) {
    console.error(err)
  }
}

// - Find all users from department (c)
async function example4() {
  try {
     
    const users = await userCollection.find({department: 'c'}).toArray()
  
  } catch (err) {
    console.error(err)
  }
}

//------Articles-----\\\\


//- Create 5 articles per each type (a, b, c)
 async function articlesTask1 () {
   try {
    const types = ['a', 'b', 'c']
    const articles =  types.map(type=>type.repeat(5).split('')).flat().map(el=>mapArticle({type:el}))
    await articleCollection.insertMany(articles)
   } catch (error) {
     console.log(error);
   }
}

// - Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]
async function articlesTask2 () {
  try{

    const {result} = await articleCollection.updateMany({type: 'a'},  {$set : { tags : ['tag1-a', 'tag2-a', 'tag3']}});

  } catch(error){
    console.log(error);
  }
 }

// - Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a
 async function articlesTask3 () {
  try{

    const {result} = await articleCollection.updateMany({type: {$ne: 'a'}}, {$set : { tags : ['tag2', 'tag3', 'super']}});

  } catch(error){
    console.log(error);
  }
 }

// Find all articles that contains tags [tag2, tag1-a]
 async function articlesTask4 () {
  try{
    const withTags = await articleCollection.find({ tags: { $in: ['tag2', 'tag1-a'] } }).toArray()
   
  } catch(error){
    console.log(error);
  }
 }

// Pull [tag2, tag1-a] from all articles
 async function articlesTask5 () {
  try{
    await articleCollection.updateMany({}, { $pull: { tags: { $in: ['tag2', 'tag1-a'] } } })
  } catch(error){
    console.log(error);
  }
 }

 ////Import stydents to DB

 async function conectStudents() {
  const students = require('./students.json');
  await studentCollection.insertMany(students);
}
