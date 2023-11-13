export const paginationfunction=({page=1,size=2})=>{
    if(!page||(page<=0)){
        page=1
    }
    if(!size||(size<=0)){
        szie=5
    }

    const limit=size //3ayz 2ad aih fy al page al wa7da
    const skip=(page-1)*size //hna maslan lw al size b 3 w al page b 2,yb2a kda al limit hysawy 3 w al skip hwa ano hygbly tany 3 fkda hwa hysyb awl 6
    
    return {limit,skip}



}