# `nexa-switch-server`

Simple HTTP server which exposes a REST API for controlling Nexa switches.

## Background

One of my first hobby projects when I got into coding was writing a [Homebridge](https://homebridge.io/) plugin for controlling Nexa switches (these cheap remote-controlled power switches you can buy from e.g. [Clas Ohlson](https://www.clasohlson.com)).

You can find that project here: [`homebridge-nexa-switch-platform`](https://github.com/DanielGiljam/homebridge-nexa-switch-platform).

As Homebridge has been updated a lot over the years, that old plugin doesn't work anymore.

Instead of rewriting the plugin to work with current versions of Homebridge, I decided to write a simple HTTP server which exposes the switch interface as a REST API.

The idea is to use this [`homebridge-http-switch`](https://github.com/Supereg/homebridge-http-switch) plugin to make requests to `nexa-switch-server`.

## Prerequisites

- A Raspberry Pi Model A or B (any generation)
- An external radio transmitter connected to your Pi's GPIO that transmits on the 433 MHz frequency
- piHomeEasy: a software for communicating with devices using the HomeEasy protocol ([github.com/nbogojevic/piHomeEasy](https://github.com/nbogojevic/piHomeEasy)) --> Check out its GitHub page for details on how to get it and install it

More information about the radio transmitter and how to connect it to the Pi can also be found on piHomeEasy's GitHub page.

**NOTE!**
After you've installed piHomeEasy, you need to make sure it's executable by others and that it has the setuid bit set.
Example of what piHomeEasy's properties should look like:

```bash
$ ls -l `which piHomeEasy`
-rwsr-xr-x 1 root staff 19056 Jun 27  2019 /usr/local/bin/piHomeEasy
```

## API Reference

### `POST /`

#### URL search params

See [main.ts#L11-L23](main.ts#L11-L23).

#### Example

```
POST /?pinNumber=0&emitterId=31415&receiverId=1&command=on
```

## Links

- [Langaton tiedonsiirto UHF-taajuudella, Antti Juntunen 2017](https://urn.fi/URN:NBN:fi:amk-2017112818502)
