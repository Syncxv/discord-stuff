# Modifying Ui / Injecting into the ui

im gonna use powercords stuff bec i like it :)

<br />

discord uses react to render their sheet. SO if you know react this will be pretty ez.

OK lets try an example. lets say i want to add a div with the text hi here:

![](https://i.imgur.com/EYYzF94.png)

how would i go about doing that? FIRST you need to know which module you want to inject into. using the chrome extention react developer tools we can find out which element contains these buttons. should look something like this:

![](https://i.imgur.com/G4KCRzA.png)

Now we now we need to inject into the `ChannelTextAreaButtons` react component.
first lets find it

```js
const { getModule } = require('powercord/webpack');
const ChannelTextAreaButtons = getModule((m) => m?.default?.type?.displayName === 'ChannelTextAreaButtons', false);
```

now let me explain HOW i get this. FIRST if you look at that picture again and YOU can see that it says memo. IF It says memo it is most likley exported as a memo SO you cant simply do `getModuleByDisplayName` that wont wrok because its a memo. SO what does a memo functional component look like? well it looks like this wigga boy

![](https://i.imgur.com/auUdT5k.png)

AND as you can see theres a type property AND in this property there will most likely be a displayName :D and we can use that to get our component.
HOWEVER if the type was a component and not a function then you would need to do `m?.default?.type?.render?.displayName ===`

ok we found it now what?

```js
const { inject } = require('powercord/injector');
inject('cool-id', ChannelTextAreaButtons, 'type', (args, res) => {
    console.log(args, res);
    return res;
});
```

now were just going to inject and check what it returns and see if we can modify anything

![](https://i.imgur.com/OgrqH15.png)

AS you can see the children of res has all the buttons in it :D. SO whatq we need to do is just push our own element into this children and return that :O

```js
const { inject } = require('powercord/injector');
const { React } = require('powercord/webpack');
inject('cool-id', ChannelTextAreaButtons, 'type', (args, res) => {
    console.log(args, res);
    const element = React.createElement(
        'div',
        {
            style: {
                width: '20px',
                alignSelf: 'center',
            },
        },
        'hi'
    );
    /* 
    // same as
    <div style={{width: '20px', alignSelf: 'center'}}>
        hi
    </div>
    */
    res.props.children.push(element);
    return res;
});
ChannelTextAreaButtons.type.displayName = 'ChannelTextAreaButtons';
```

result:
![](https://i.imgur.com/QSgBWt6.png)

<br />

ok this is such a shit explanation but ill improve it later :)
