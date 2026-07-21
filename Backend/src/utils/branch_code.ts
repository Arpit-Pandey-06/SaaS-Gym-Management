interface branch_code_format{
    branch_code:string
}

export function branch_code_genrator(code:branch_code_format|null){
     if(code === null){
        return "BR0001"
     }
     const strCode = code.branch_code
     const current_value = parseInt(strCode.slice(2),10)
     const next_value = current_value+1
    
    return `BR${next_value.toString().padStart(4,"0")}`
     

     
}