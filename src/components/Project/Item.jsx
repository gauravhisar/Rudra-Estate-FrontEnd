import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import EditProject from './EditProject';
import EditPerson from '../Person/EditPerson';


export default function Item({ title, obj, index, updateItem, deleteItem }) {

    const history = useHistory()
    const [editing_view, setEditingView] = useState(false)


    const displayDetails = () => {
        let fields = Object.keys(obj)
        fields = fields.filter((field)=>{
            return !["id","name", "plots", "deal"].find((a)=>a===field)
        })

        function goToDetailsPage(){
            history.push(`/${title.toLowerCase()}/${obj.id}`)
        }

        return (
            <tr>
                <th scope="row" style = {{cursor: "pointer"}} onClick = {goToDetailsPage}>
                    {obj.name}
                </th>
                {fields.map((field) => {
                    return <td key={field} style = {{cursor: "pointer"}} onClick = {goToDetailsPage}> {obj[field]} </td>
                })}
                <td className="text-center"><button onClick={() => setEditingView(true)} style={{ margin: '0px' }} type="button" className="btn btn-sm btn-secondary">Edit</button></td>
                <td>
                    {title === 'Projects' ? <></> :
                        <button onClick={() => deleteItem(index,obj)} style={{ margin: '0px' }} type="button" className="btn btn-sm btn-danger">Delete</button>
                    }

                </td>
            </tr>
        )
    }



    if (editing_view === true) {
        return (
            <>
                {title === 'Projects' ?
                    <EditProject title={title} obj={obj} index={index} updateItem={updateItem} setEditingView={setEditingView} /> :
                    <EditPerson title={title} obj={obj} index={index} updateItem={updateItem} setEditingView={setEditingView} />
                }
            </>
        )
    }
    else {
        return (
            <>
                {displayDetails()}
            </>
        )

    }
}