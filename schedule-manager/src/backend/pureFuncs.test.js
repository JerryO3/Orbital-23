import * as fn from './functions';
import * as collab from 'collab';

// const sum = require('./sum');

// const debug = test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

// This test document will only test pure functions 
// that can be called with arguments. This is because
// there is a need to test for edge-case inputs.

/* 
queryByValue(dbRef, field, queryId)

returns: promise containing array of db data with a 
child field equivalent to the specified field and
a child value equivalent to the specified queryId

Edge-Cases:
1. Empty String dbRef => takes the db root
2. Nonexistent dbRef => return []
3. Nonexistent field => return []
4. Non-String dbRef arg => error to catch
5. Non-String field arg => error to catch
 */

test('queryByValueEC1', () => {
    expect(fn.queryByValue('',f,f))
});

test('queryByValueEC2', () => {
    expect(fn.queryByValue('',f,f))
});

test('queryByValueEC3', () => {
    expect(fn.queryByValue('',f,f))
});

test('queryByValueEC4', () => {
    expect(fn.queryByValue('',f,f))
});

test('queryByValueEC5', () => {
    expect(fn.queryByValue('',f,f))
});

/*
registerWithEmailandPw(username, email, password)

Edge-Cases:
1. Empty String username => no issue
2. Empty String email => throw error to catch
3. Empty String password => throw error
*/

test('registerWithEmailandPwEC1', () => {
    expect(fn.registerWithEmailandPw('',f,f))
});

test('registerWithEmailandPwEC2', () => {
    expect(fn.registerWithEmailandPw('',f,f))
});

test('registerWithEmailandPwEC3', () => {
    expect(fn.registerWithEmailandPw('',f,f))
});

/*
login(email, password)

Edge-Cases:
1. Wrong password => Should notify user
2. Non-existent email => Should notify user
*/

test('loginEC1', () => {
    expect(fn.login(email, password))
});

test('loginEC2', () => {
    expect(fn.login(email, password))
});

/*
getField(field)

Edge-Cases:
1. Non-existent Field => []
*/

test('getField', () => {
    expect(fn.getField(f))
});

/*
sendPasswordResetEmail(email)

Edge-Cases:
1. Non-existent Email (should be caught at resetPw)
=> throw error to catch
*/

test('sendPasswordResetEmailEC1', () => {
    expect(fn.sendPasswordResetEmail(f))
});

/*
newProject(projectName)

Edge-Cases:
1. Empty String ProjectName
=> creates an anonymous project
*/

test('newProjectEC1', () => {
    expect(fn.newProject(f))
});

/*
newEventByStartEnd(
    projectId,
    eventName,
    startDate,
    startTime,
    endDate,
    endTime,
    member
    )

Edge-Cases:
1. Empty string projectId 
=> Error(every event should have a project?)
2. Empty string eventName
=> creates anonymous event
3. Empty member array
=> error to catch
4. member is not an array
=> error to catch
*/

test('newEventByStartEndEC1', () => {
    expect(fn.newEventByStartEnd(f))
});

test('newEventByStartEndEC2', () => {
    expect(fn.newEventByStartEnd(f))
});

test('newEventByStartEndEC3', () => {
    expect(fn.newEventByStartEnd(f))
});

test('newEventByStartEndEC4', () => {
    expect(fn.newEventByStartEnd(f))
});
