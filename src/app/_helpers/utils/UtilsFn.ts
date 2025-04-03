

export function arraySimpleEquals(arr1 : [], arr2 : []) : boolean{
    let equals = (arr1.length === arr2.length) && arr1.every((value, index) => value === arr2[index])
    return equals;
}