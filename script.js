const http = require('http')
const fs = require('fs')
const axios = require('axios');

const proveedoresURL = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json'
const clientesURL = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json'
let contentproveedores
let contentclientes
let html 
const getProovedores = async  () => {
    await axios.get(proveedoresURL).then((response)=>{
        contentproveedores = response.data
    })
}

const getClientes = async  () => {
    await axios.get(clientesURL).then((response)=>{
        contentclientes = response.data
    })
}


const server = http.createServer(async function (req, res) {

    
    
    res.writeHead(200, {'Content-Type': 'text/html', 'charset':'utf-8'})
    
    let html = fs.readFileSync('index.html',{encoding:'utf-8',flag:'r'})

    if (req.url === "/api/proveedores"){
        let head = `<th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th> `
        html = html.replace('{{url}}','Lista Proveedores').replace('{{tableHead}}', head)

        await getProovedores()
        let i = 1
        let bodyTable = ''
        console.log(contentproveedores)

        for (let j = 0 ; j < contentproveedores.length;j++){
            let proveedor = contentproveedores[j];
            bodyTable+= `<tr>`
            bodyTable+= `<td> ${i}</td> <td>${proveedor.nombrecompania}</td> <td>${proveedor.nombrecontacto}</td>`  
            bodyTable+= `</tr>`
            i++
        }

        html= html.replace('{{tableInfo}}',bodyTable)

        fs.writeFileSync('proveedores.html',html)
        fs.createReadStream('proveedores.html').pipe(res)
        fs.unlinkSync('proveedores.html')


    }

    if (req.url === "/api/clientes"){
        let head = `<th scope="col">ID</th>
        <th scope="col">Nombre Compañia</th>
        <th scope="col">Contacto</th> `
        html = html.replace('{{url}}','Lista Clientes').replace('{{tableHead}}', head)

        await getClientes()
        let bodyTable = ''
        for (let j = 0 ; j < contentclientes.length;j++){
            let proveedor = contentclientes[j];
            console.log(proveedor)
            bodyTable+= `<tr>`
            bodyTable+= `<td> ${proveedor.idCliente}</td> <td>${proveedor.NombreCompania}</td> <td>${proveedor.nombrecontacto}</td>`  
            bodyTable+= `</tr>`
        }

        html= html.replace('{{tableInfo}}',bodyTable)
        fs.writeFileSync('clientes.html',html)
        fs.createReadStream('clientes.html').pipe(res)
        fs.unlinkSync('clientes.html')
    }

    })
    

server.listen(process.env.PORT || 8081)