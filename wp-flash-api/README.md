# Wordpress Automation

## What?

This project purpose is to reduce boostraping process of a new wordpress instance. It allows to create,manage wordpress instances in a simple way.

## Why?

Create a new wordpress is a time consuming and boring process. It has to be a better way which automates all of repetitive tasks.

## How?

Use various technologies in order to achieve mentioned above. Run wordpresses in Docker (https://www.docker.com/) environment is more secure then just put into some apache server. Further, containerization technology makes deployment more easier too.
Rest API is simplifying to manage wordpresses and hide all the technical details from developer. In addition, it makes able to attach any front-end application to it. At the time of writing there is only one front-end which is a terminal application.

## Features

These have been done:

* Fully installed wordpress with themes and plugins less than one minute
* More secure environment because of containerization technology
* Flexible API, you can attach any frontend

There is a lots of room for improvement:

* Managing plugins and themes on running wordpress instance
* Web or desktop GIU
* Implement deployment process through FTP or even AWS
* Real-time metrics from instances
* Backup and restore
* ... and more

## Technical details

This section required some technical backround. The project has two main parts:

* Backend
* Frontend

### Backend

It responsible for wordpress project creation, docker service orchestration and provide nice API for managing all of this. It can be installed any linux server which has docker and nodejs.

Requirements:

* nodejs 11
* docker engine
* docker-compose

Used technologies:

* Docker (<https://www.docker.com/>) for handle containers
* NodeJS (<https://nodejs.org/en/>)
* Fastify provides the API (<https://www.fastify.io/>)
* Treafik creates dynamic routing () e.g. `test.hostname` or `shoes.hostname`. that is mean no need for web server like apache

### Frontend

Frontend communicates backend via rest API. There is one frontend for now which is an terminal application and written in React. Supports MacOS and linux.

Reguirements:

* nodejs 11

Used technologies:

* React (<https://reactjs.org/>)
* Ink (<https://github.com/vadimdemedes/ink#readme>)

## Create a Wordpress instance step by step

It will be shown how project kickstart works. 

