# QWSR - POC

This repository is a POC for testing a signalR implementation on Qwik.
There are three branches:
The main contains a server developed in C# - webApi and is merged into the other ones.
The Client/Qwik contains an example of the basic implementation of  "@microsoft/signalr", (only read function).
The Client/React contains an example of the basic implementation of  "@microsoft/signalr", (read/write functions).

For testing this POC we provide a dockerfile and docker compose for creating a container that runs an instance of server with signalR.
After the creation of the container, you can run Qwik or React app and test it.

## Server Run procedure

You must create an image using a the dockerfile that is inside a WebApp folder.
So move to the server folder QWSR-Server and build the docker image using that command:

```bash
docker build -t besignalr:1.1 -f QWSR.WebApp/Dockerfile .
```

Now it's possible to create the server container running a compose:

```bash
docker compose -f ../Docker/docker-compose.yml up 
```

## Clients

Using Client/Qwik or Client/React branch you can try communication via signalR with the server app.
If you want to use simultaneously the clients, you can merge Client/* into a unique new branch or clone the repository twice.

### Qwik

This project is a basic Qwik blank project created with Vite, so to run it do this:

```bash
pnpm install 
```

```bash
pnpm start 
```

### React

This project is a basic React blank project created with Vite, so to run it do this:

```bash
pnpm install 
```

```bash
pnpm run dev 
```

## License

[MIT](https://choosealicense.com/licenses/mit/)