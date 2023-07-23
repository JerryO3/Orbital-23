import * as fn from './functions';
import * as collab from './collaboration';
import { isSupported } from "firebase/analytics";
import { analytics } from './Firebase';

// // test('isSupported', () => {
// //     console.debug('check is supported', isSupported())
// // })

// // This test document will only test pure functions 
// // that can be called with arguments. This is because
// // there is a need to test for edge-case inputs.

// /* 
// queryByValue(dbRef, field, queryId) DEPRECATED

// returns: promise containing array of db data with a 
// child field equivalent to the specified field and
// a child value equivalent to the specified queryId

// Edge-Cases:
// 1. Empty String dbRef => takes the db root
// 2. Nonexistent dbRef => return undefined
// 3. Nonexistent field => return undefined
// 4. Non-String dbRef arg => error to catch
// 5. Non-String field arg => error to catch
// 6. Field is not designated indexOn => return undefined
//  */

jest.spyOn(window, 'alert').mockImplementation(() => {});

const a = 
{"uid":"N0cfVfAknhXMVXhMuA8oY51OLot1","email":"jieruioon@gmail.com","emailVerified":true,"displayName":"Oon Jie Rui","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c","providerData":[{"providerId":"google.com","uid":"106575792657294230311","displayName":"Oon Jie Rui","email":"jieruioon@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c"}],"stsTokenManager":{"refreshToken":"APZUo0RUGozRIqRAvATmmX86XkzPlAnCbjtxGlEBXctqXAEUp59YZ1462JUgW9SdaUN6cOsA0EWNHBY1GWohh23JS6heusq4pF_nkNAzWrxgRwXRm6FVmFH99bXoQjB464AvwrAdMSQApP3P_qP0nWMjGWGlp15WboSIyABSq5QUho22smyt_kbtMEkVaXU2WGHUhdALy3cLeX0cM2mdEx-88p68rjJ-krZQdR52rVinVDHx5Q8Oda4HwTWu-OuH1fr-s2KUo2Eo89T1T3RnWrLdwoutVHUO8zcT3QLYULwjFu_Yg5Ifxw1r97lHO39R30vvgC7M7Shg2_MaEn_kY3mNYsYAElE3OMHmHBJbA9y3br2Z6SM7EXDwguBUW-xsE6NCS074EIu0LbvJPu-nbyufZMz_6awTWyZZmzSVUA3WlBvcX83Mc9tYDmkiznHQR-5qYmeKjZ_H","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMDNhZTdmNDczZjJjNmIyNTI3NmMwNjM2MGViOTk4ODdlMjNhYTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiT29uIEppZSBSdWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3ZqeDRDa0hrOHBHbFB4cjg0eXBPZFQ1bm41YVdGWHhtTkFGY3A9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2NoZWR1bGUtbWFuYWdlci05NDU3OSIsImF1ZCI6InNjaGVkdWxlLW1hbmFnZXItOTQ1NzkiLCJhdXRoX3RpbWUiOjE2ODczNDM4NzgsInVzZXJfaWQiOiJOMGNmVmZBa25oWE1WWGhNdUE4b1k1MU9Mb3QxIiwic3ViIjoiTjBjZlZmQWtuaFhNVlhoTXVBOG9ZNTFPTG90MSIsImlhdCI6MTY4NzY2NjE2NCwiZXhwIjoxNjg3NjY5NzY0LCJlbWFpbCI6ImppZXJ1aW9vbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjU3NTc5MjY1NzI5NDIzMDMxMSJdLCJlbWFpbCI6WyJqaWVydWlvb25AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.UAN_CWkv65J05B3wFp-Pbd2x-pesuto-HRDQK7nfepzCv3dLI-9gQs6HRHLNMI-b9DrNRe2iDjHPb47tkCOzBTjuNadypxfi5EBb1frILysFHW8SSLhGvXmboeIE3_jnuJRKLrFgNnbmNoPxtAOBimSJxFx1W83gpEpmh8h-y-cepcjcY7jTowZHpSHntgWXNHFv52ypOaVvcwcbbJEPDULiKiEIqRzMT0-AGg2TLuBgyaKrb9SlMiMGsslfxFLWlhbZrvBG32fi6Z43lEaRzmPzLgoXx5qMSCDVgXhGNGyP537inpz5_RxbgZYeQ8mU41LRup3M0luGy12-pkFQUA","expirationTime":1687669760780},"createdAt":"1687343828059","lastLoginAt":"1687343877450","apiKey":"AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s","appName":"[DEFAULT]"};

const b = JSON.stringify(a);
localStorage.setItem('user', b)

test('queryByValue', async () => {
    const a = await fn.queryByValue('events','projectId',"456b13e5-9a83-4998-b6c8-6eb1f55af32c").then(x => expect(x).toStrictEqual(
        [
            {
            "endDateTime": 1689015000000,
            "itemId": "06277721-2c08-49ba-a063-192d2b5ed70f",
            "members": {
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "D",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689011400000,
            },
            {
            "endDateTime": 1689916200000,
            "itemId": "19dc8cf5-4510-4ff0-a21e-d3a30825ed5c",
            "members": {
            "N0cfVfAknhXMVXhMuA8oY51OLot1": true,
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Test2",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689873000000,
            },
            {
            "endDateTime": 1690002600000,
            "itemId": "1c700a8e-8f5b-430e-9203-8f00a647af47",
            "members": {
            "N0cfVfAknhXMVXhMuA8oY51OLot1": true,
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Test2",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689959400000,
            },
            {
            "endDateTime": 1690009500000,
            "itemId": "366f79bc-8bb3-4481-aa74-acbe9af04f19",
            "members": {
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "A",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1690005900000,
            },
            {
            "endDateTime": 1689628800000,
            "itemId": "a0c6a85e-8811-433f-8466-6c20746dde05",
            "members": {
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Event1",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689625200000,
            },
            {
            "endDateTime": 1689636000000,
            "itemId": "a8b95534-7c91-4e21-b076-24fc90b7b343",
            "members": {
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Event1",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689632400000,
            },
            {
            "endDateTime": 1689746700000,
            "itemId": "c9e60fdc-baef-4ea3-9485-47983fd7428f",
            "members": {
            "N0cfVfAknhXMVXhMuA8oY51OLot1": true,
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Test",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689699900000,
            },
            {
            "endDateTime": 1689833100000,
            "itemId": "e9f36e46-e708-46cd-b4a2-0772a1052627",
            "members": {
            "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2": true,
            },
            "name": "Test",
            "projectId": "456b13e5-9a83-4998-b6c8-6eb1f55af32c",
            "startDateTime": 1689786300000,
            },
        ]
    ))
});

test('queryByValueEC1', async () => { // to fix behaviour
    await expect(fn.queryByValue('','projects',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")).rejects.toEqual(
        "Error: child failed: path argument was an invalid path = \"\". Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\""
    )
});

test('queryByValueEC2', async () => { // to fix behaviour
    const a = await fn.queryByValue('projects','nonexistentField',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
    .then(x => expect(x).toBe())
});

test('queryByValueEC3', async () => { // to fix behaviour
    const a = await fn.queryByValue('projects','nonexistentField',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")
    .then(x => expect(x).toBe())
});

test('queryByValueEC4', async () => { // to fix behaviour
    await expect(fn.queryByValue('events',123,"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")).rejects.toEqual(
        "Error: orderByChild failed: path argument was an invalid path = \"123\". Paths must be non-empty strings and can't contain \".\", \"#\", \"$\", \"[\", or \"]\""
    )
});

test('queryByValueEC5', async () => { // to fix behaviour
    await expect(fn.queryByValue(123,'projects',"aDQfdKcJ0vb91IjwnYhLwYaFgfZ2")).rejects.toEqual(
        "Non-string db ref"
    )
});

test('queryByValueEC6', async () => { // to fix behaviour
    const a = await fn.queryByValue('events','startDateTime',"project1")
    .then(x => expect(x).toBe())
});

/*
getField(field)

Edge-Cases:
1. Non-existent Field => []
*/

test('getFieldEC1', async () => {
    const a = await fn.getField("noSuchField")
    .then(x => expect(x).toBe(null))
});

/*
newProject(projectName)

Edge-Cases:
1. Empty String ProjectName
=> creates an anonymous project
*/

test('newProjectEC1', async () => {
    const a = await fn.newProject("")
    .then(x => {fn.queryByValue('projects', 'name', "").then(y => expect(y).toStrictEqual([
        {
        "itemId": x,
        "members": {
        "N0cfVfAknhXMVXhMuA8oY51OLot1": true,
        },
        "name": "",
        }
    ])); return x})
    .then(x => localStorage.setItem('projectId', x))
    .then(() => fn.removeProject())
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

test('newEventByStartEnd', async () => {
    const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
    const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
        // .then(x => {console.debug(x); return x})
        .then(x => fn.newEventByStartEnd(
        localStorage.getItem('projectId'),
        'RandomUid1',
        'newEvent',
        '2023/08/10',
        '10:30',
        '2023/08/10',
        '11:30',
        x.map(y => y.itemId))
        )
    .then(x => expect(x).toBe(true))
    .then(() => localStorage.setItem('eventId', 'RandomUid1'))
    .finally(() => {fn.removeEvent(); fn.removeProject()})
});

// test('newEventByStartEndEC1', async () => { // Checks implemented at NewEvent
//     const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
//     const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
//         .then(x => fn.newEventByStartEnd(
//         "",
//         'RandomUid1',
//         'newEvent',
//         '2023/08/10',
//         '10:30',
//         '2023/08/10',
//         '11:30',
//         x.map(y => y.itemId))
//         )
//     .then(x => expect(x).toBe(false))
//     .then(() => localStorage.setItem('eventId', 'RandomUid1'))
//     .finally(() => {fn.removeEvent(); fn.removeProject()})
// });

test('newEventByStartEndEC2', async () => {
    const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
    const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
        .then(x => fn.newEventByStartEnd(
        localStorage.getItem('projectId'),
        'RandomUid1',
        '',
        '2023/08/10',
        '10:30',
        '2023/08/10',
        '11:30',
        x.map(y => y.itemId))
        )
    .then(x => expect(x).toBe(true))
    .then(() => localStorage.setItem('eventId', 'RandomUid1'))
    .finally(() => {fn.removeEvent(); fn.removeProject()})
});

// test('newEventByStartEndEC3', async () => { // Checks implemented at NewEvent
//     const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
//     const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
//         .then(x => fn.newEventByStartEnd(
//         localStorage.getItem('projectId'),
//         'RandomUid1',
//         'newEvent',
//         '2023/08/10',
//         '10:30',
//         '2023/08/10',
//         '11:30',
//         [])
//         )
//     .then(x => expect(x).toBe(false))
//     .then(() => localStorage.setItem('eventId', 'RandomUid1'))
//     .finally(() => {fn.removeEvent(); fn.removeProject()})
// });

// test('newEventByStartEndEC4', async () => { // Checks implemented at NewEvent
//     const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
//     const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
//         .then(x => fn.newEventByStartEnd(
//         localStorage.getItem('projectId'),
//         'RandomUid1',
//         'newEvent',
//         '2023/08/10',
//         '10:30',
//         '2023/08/10',
//         '11:30',
//         123)
//         )
//     .then(x => expect(x).toBe(false))
//     .then(() => localStorage.setItem('eventId', 'RandomUid1'))
//     .finally(() => {fn.removeEvent(); fn.removeProject()})
// });

/*
getHandle(uid) 

Edge-Cases:
1. Empty String uid
=> error to catch
2. Invalid uid
=> error to catch
*/

test('getHandleEC1', async () => {
    const a = await fn.getHandle("")
    .then(x => expect(x).toBe(null))
});

test('getHandleEC2', async () => {
    const a = await fn.getField("noSuchUid")
    .then(x => expect(x).toBe(null))
});

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

test('updateProfileEC1', async () => {
    const a = await fn.updateProfile("",7,"@JerryO4")
    .then(() => fn.getField("username").then(x => expect(x).toBe("")))
    .then(() => fn.getField("notificationDuration").then(x => expect(x).toBe(7)))
    .then(() => fn.getField("telegramHandle").then(x => expect(x).toBe("@JerryO4")))
});

test('updateProfileEC2', async () => {
    const a = await fn.updateProfile("Oon Jie Rui",7,"")
    .then(() => fn.getField("username").then(x => expect(x).toBe("Oon Jie Rui")))
    .then(() => fn.getField("notificationDuration").then(x => expect(x).toBe(7)))
    .then(() => fn.getField("telegramHandle").then(x => expect(x).toBe("")))
});

test('removeEvent', async () => {
    const setupProj = await fn.newProject("newProjTest").then(x => localStorage.setItem('projectId', x));
    const a = await collab.getMembers("projects/", localStorage.getItem('projectId'))
        .then(x => fn.newEventByStartEnd(
        localStorage.getItem('projectId'),
        'RandomUid1',
        'newEvent',
        '2023/08/10',
        '10:30',
        '2023/08/10',
        '11:30',
        x.map(y => y.itemId))
        )
    .then(x => expect(x).toBe(true))
    .then(() => localStorage.setItem('eventId', 'RandomUid1'))

    const b = await fn.removeEvent()
    .then(x => expect(x).toBe(undefined))
    .finally(() => {fn.removeEvent(); fn.removeProject()})
})

test('getUserId', async () => {
    localStorage.removeItem('user');
    expect(fn.getUserId).toThrow('Not Logged In');
    localStorage.setItem('user', b);
})

test('login', async () => {
    await expect(fn.login('','').catch(e => e.toString())).resolves.toEqual(
        "FirebaseError: Firebase: Error (auth/network-request-failed)."
    )
})

test('getItem', async () => {
    const a = await fn.getItem('periods/', '334597c6-9eb8-42eb-aa82-17b9807fe8eb')
    expect(a).toEqual(
        {"blockoutId": "f76ff51a-7432-4e99-8a4d-e5cb7f000c3d", "endDateTime": 1690141500000, "name": "A", "startDateTime": 1690134300000, "userId": "aDQfdKcJ0vb91IjwnYhLwYaFgfZ2"}
    )
})

test('getItemEC1', async () => {
    const a = await fn.getItem('periods/', 'noSuchPeriod')
    expect(a).toEqual(null)
})

test('getItemEC2', async () => {
    const a = await fn.getItem('noSuchDB', '334597c6-9eb8-42eb-aa82-17b9807fe8eb')
    expect(a).toEqual(null)
})


