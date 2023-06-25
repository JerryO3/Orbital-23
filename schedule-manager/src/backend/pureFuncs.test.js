// import * as fn from './functions';
// import * as collab from './collaboration';
// import { isSupported } from "firebase/analytics";
// import { analytics } from './Firebase';

// // test('isSupported', () => {
// //     console.debug('check is supported', isSupported())
// // })

// // This test document will only test pure functions 
// // that can be called with arguments. This is because
// // there is a need to test for edge-case inputs.

// /* 
// queryByValue(dbRef, field, queryId)

// returns: promise containing array of db data with a 
// child field equivalent to the specified field and
// a child value equivalent to the specified queryId

// Edge-Cases:
// 1. Empty String dbRef => takes the db root
// 2. Nonexistent dbRef => return []
// 3. Nonexistent field => return []
// 4. Non-String dbRef arg => error to catch
// 5. Non-String field arg => error to catch
// 6. Field is not designated indexOn => ??
//  */

// test('queryByValue', async () => {
//     const a = await fn.queryByValue('projects','userId',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2").then(x => expect(x).toStrictEqual(
//         [
//             {
//               itemId: '336a33fe-2aa5-4963-a6aa-4ed4b4adf5b9',
//               name: 'project1',
//               userId: 'aDQfdKcJ0vb91IjwnYhLwYaFgfZ2'
//             },
//             {
//               itemId: '88cc97ea-30bb-40b5-abd5-b66c95ebfd8f',
//               members: { aDQfdKcJ0vb91IjwnYhLwYaFgfZ2: true },
//               name: '54321',
//               userId: 'aDQfdKcJ0vb91IjwnYhLwYaFgfZ2'
//             },
//             {
//               itemId: 'd766e26e-0fd4-4275-825b-268219315550',
//               members: { aDQfdKcJ0vb91IjwnYhLwYaFgfZ2: true },
//               name: '1234',
//               userId: 'aDQfdKcJ0vb91IjwnYhLwYaFgfZ2'
//             },
//             {
//               itemId: 'e5805c8b-8727-4def-a16c-8c121c194095',
//               members: { aDQfdKcJ0vb91IjwnYhLwYaFgfZ2: true },
//               name: 'Test1323',
//               userId: 'aDQfdKcJ0vb91IjwnYhLwYaFgfZ2'
//             },
//             {
//               itemId: 'fc82b69d-3ed1-4aa8-baac-c23f36737167',
//               members: { aDQfdKcJ0vb91IjwnYhLwYaFgfZ2: true },
//               name: '1234',
//               userId: 'aDQfdKcJ0vb91IjwnYhLwYaFgfZ2'
//             }
//           ]
//     ))
// });

// test('queryByValueEC1', async () => { // to fix behaviour
//     const a = await fn.queryByValue('','projects',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
//     .then(x => expect(x).toBe([]))
// });

// test('queryByValueEC2', async () => { // to fix behaviour
//     const a = await fn.queryByValue('nonexistentRef','projects',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
//     .then(x => expect(x).toBe([]))
// });

// test('queryByValueEC3', async () => { // to fix behaviour
//     const a = await fn.queryByValue('projects','nonexistentField',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
//     .then(x => expect(x).toBe([]))
// });

// test('queryByValueEC4', async () => { // to fix behaviour
//     const a = await fn.queryByValue(123,'userId',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
//     .then(x => expect(x).toBe([]))
// });

// test('queryByValueEC5', async () => { // to fix behaviour
//     const a = await fn.queryByValue(123,'userId',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
//     .then(x => expect(x).toBe([]))
// });

// test('queryByValueEC6', async () => { // to fix behaviour
//     const a = await fn.queryByValue('projects','name',"project1")
//     .then(x => expect(x).toBe([]))
// });

// /*
// registerWithEmailandPw(username, email, password)

// Edge-Cases:
// 1. Empty String username => no issue
// 2. Empty String email => throw error to catch
// 3. Empty String password => throw error
// */

// test('registerWithEmailandPwEC1', async () => {
//     const a = await fn.registerWithEmailandPw('','01230123@gmail.com',"Password123")
//     .then(x => expect(x).toBe([]))
// });

// test('registerWithEmailandPwEC2', async () => {
//     const a = await fn.registerWithEmailandPw('TestProfile','',"Password123")
//     .then(x => expect(x).toBe([]))
// });

// test('registerWithEmailandPwEC3', async () => {
//     const a = await fn.registerWithEmailandPw('TestProfile','012301234@gmail.com','')
//     .then(x => expect(x).toBe([]))
// });

// /*
// login(email, password)

// Edge-Cases:
// 1. Wrong password => Should notify user
// 2. Non-existent email => Should notify user
// */

// test('loginEC1', () => {
//     expect(fn.login(email, password))
// });

// test('loginEC2', () => {
//     expect(fn.login(email, password))
// });

// /*
// getField(field)

// Edge-Cases:
// 1. Non-existent Field => []
// */

// test('getField', () => {
//     expect(fn.getField(f))
// });

// /*
// sendPasswordResetEmail(email)

// Edge-Cases:
// 1. Non-existent Email (should be caught at resetPw)
// => throw error to catch
// */

// test('sendPasswordResetEmailEC1', () => {
//     expect(fn.sendPasswordResetEmail(f))
// });

// /*
// newProject(projectName)

// Edge-Cases:
// 1. Empty String ProjectName
// => creates an anonymous project
// */

// test('newProjectEC1', () => {
//     expect(fn.newProject(f))
// });

// /*
// newEventByStartEnd(
//     projectId,
//     eventName,
//     startDate,
//     startTime,
//     endDate,
//     endTime,
//     member
//     )

// Edge-Cases:
// 1. Empty string projectId 
// => Error(every event should have a project?)
// 2. Empty string eventName
// => creates anonymous event
// 3. Empty member array
// => error to catch
// 4. member is not an array
// => error to catch
// */

// test('newEventByStartEndEC1', () => {
//     expect(fn.newEventByStartEnd(f))
// });

// test('newEventByStartEndEC2', () => {
//     expect(fn.newEventByStartEnd(f))
// });

// test('newEventByStartEndEC3', () => {
//     expect(fn.newEventByStartEnd(f))
// });

// test('newEventByStartEndEC4', () => {
//     expect(fn.newEventByStartEnd(f))
// });

// /*
// getHandle(uid) 

// Edge-Cases:
// 1. Empty String uid
// => error to catch
// 2. Invalid uid
// => error to catch
// */

// test('getHandleEC1', () => {
//     expect(fn.getHandle())
// });

// test('getHandleEC2', () => {
//     expect(fn.getHandle())
// });

// /*
// updateProfile(username, 
//     notificationDuration, 
//     telegramHandle)

// Edge-Cases:
// 1. Empty String Username
// => No display name
// 2. Empty String telegramHandle
// => No telegram Handle
// */

// test('updateProfileEC1', () => {
//     expect(fn.updateProfile())
// });

// test('updateProfileEC2', () => {
//     expect(fn.updateProfile())
// });
