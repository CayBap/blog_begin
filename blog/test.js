let add = (a,b)=>{
    return new Promise((resolve,reject) =>{
        setTimeout(function() {
            if(typeof a != 'number'||typeof b !='number'){
                return reject(new Error("Loi"));
            }
            resolve(a+b);
        }, 1000);
    });
}
add(1,'').then((resolve)=>{
    console.log(resolve);
},(err)=>{
    console.log(err + '');
})