export class ApiFeatures{
    //h3ml constructor 3l4an y2awm al class
    constructor(mongoseQuery,queryData){
        this.mongoseQuery=mongoseQuery,
        this.queryData=queryData

    }
    //make filter for the search
    filter=()=>{
    const excludedQuery=['sort','page','size','searchKey','fields']//dy 7agat htb2a mab3ota fy al query bs ana m4 3ayzha tygy m3aya fy al result
    //h3ml loop 3ala 2ly gayly fy al query
    let filterQuery={ ...this.queryData } //hna ana 3amlt kda 3l4an yb2a wa5d nos5a mn al req.query fa 2y edit h3mlo m4 hysam3 fy al 2asl
    excludedQuery.forEach(ele=>{
        delete filterQuery[ele] //hna ana m7attha4 kda >>req.query.ele 3l4an kda kan hyro7 ydawr 3ala 7aga gwa al query asmha ele ,lkn lma hb3tha fy array fa k2ny b3talo al key 2ly hy3mal search byh
        // res.status(200).json({message:"DONE",products})
    })//kda hwa hya5od al sortr awl mara ka al ele w ydawr byh wy3ml delete whakza
    filterQuery= JSON.parse(JSON.stringify(filterQuery).replace(/lt|lte|gt|gte/g,((match)=>{//ast5dmt stringfy 3l4an 2y gayly dh obj wana 3atza at3aml m3ah ka string wb3d ma ht3aml m3ah ka string h3mlo parse 3l4an yrg3 obj tany
        return `$${match}` //ht7ot nafs al 7aga 2ly hya maslan lt bs ablha $ wal $ al tanya dy bt3t al variable 
    })))
    this.mongoseQuery.find(filterQuery)
    return this
    }
     //to sort the data that come
    sort=()=>{
        this.queryData.sort=this.queryData.sort?.replace(/,/g,' ') //replace all the commas with spaces
       this.mongoseQuery.sort(this.queryData.sort)
       return this
    }
    // //select for spacific fields/items y3ny ygyb al names bs aw al prices bs
    fields=()=>{
        this.queryData.fields=this.queryData.fields?.replace(/,/g,' ')
        this.mongoseQuery.select(this.queryData.fields)
        return this
    }
     //search with searchkey 
    search=()=>{
        if(this.queryData.searchkey){
            this.mongoseQuery.find({
                $or:[
                    {    name:{
                        $regex:this.queryData.searchkey//contain the search key
                    }
                },
                    {
    
                        description:{
                            $regex:this.queryData.searchkey
                        }
                    }
                
                ]
            
            })
        }
        return this
    }

}