import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  interface TreeNode {
    sn: string;
    name: string;
    valOne?: string;
    valTwo?: string;
    subItems?: TreeNode[]
  };

  const createData = (
      sn: string,  name: string, 
      valOne: string = "",  valTwo: string = "", 
  ): TreeNode => {
    return {sn, name, valOne, valTwo}
  }
  
  const inputDataArry = [
    createData("Cert_1", "BigItemONE", "", ""),
    createData("Cert_1.1", "smallItemA", "111", "111"),
    createData("Cert_1.2", "smallItemB", "112", "112"),
    createData("Cert_2", "BigItemTWO", "", ""),
    createData("Cert_2.1", "smallItemA", "221", "221"),
  ]
  
  // console.log(JSON.stringify(inputData, null, 2));
  const outputList: Array<TreeNode> = [];
  inputDataArry.forEach((row) => {
    const {sn, name, valOne, valTwo} = row;
    if(!sn.includes('.')){
      const newMainObj: TreeNode = { sn, name };
      newMainObj.subItems = []; 
      outputList.push(newMainObj);
    } else {
      const mainObj = outputList.at(-1) ?? {} as Partial<TreeNode>;
      const newSubObj = {
        sn, name, valOne, valTwo
      };
      (mainObj.subItems ??= []).push(newSubObj);
    }
  })
  console.log(JSON.stringify(outputList, null, 2)); 


  const outputArray: Array<TreeNode> = [];
  const pushObjToArry = (obj: TreeNode, arr: Array<TreeNode>): void => {
    const { sn, name, valOne = "", valTwo = "", subItems } = obj;
    arr.push(createData(sn, name, valOne, valTwo));
    if (subItems) {
      subItems.forEach((itemObj) => {
        pushObjToArry(itemObj, outputArray);
      });
    }
  }
  outputList.forEach((mainObj) => {
    pushObjToArry(mainObj, outputArray);
  });

  console.log(outputArray); 
  
  return (
    <div className={styles.container}>
    </div>
  )
}

export default Home
