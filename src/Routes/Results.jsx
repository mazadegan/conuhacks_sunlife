import { useState, useEffect } from 'react';
import { reCalculate } from '../functions';
import Modal from '../components/Modal';
import { blurbs } from '../blurbs';

const Results = ({ data }) => {

    const [lumpSum, setLumpSum] = useState(0);
    const [stipend, setStipend] = useState(0);

    const handleParameterChange = () => {
        // age, retirementAge, expectancyAge, currentSavings, debt, debtInterest, gradDate, income, endSavings
        const fetch = reCalculate(
            parseFloat(localData['age'][0]),
            parseFloat(localData['retirementAge'][0]),
            parseFloat(localData['expectancyAge'][0]), // ?
            parseFloat(localData['savings'][0]),
            parseFloat(localData['savingsRate'][0]),
            parseFloat(localData['debt'][0]),
            parseFloat(localData['debtRepayment'][0]),
            parseFloat(localData['debtInterest'][0]), //debtinterest
            new Date(localData['gradDate'][0]), //gradDate
            parseFloat(localData['income'][0]),
            0.07,
            0
        )

        setLumpSum(fetch.totalMoney);
        setStipend(fetch.stipend);


    }

    useEffect(() => {
        handleParameterChange();
    }, [])

    const localData = { ...data };

    for (let i in localData) {
        localData[i] = useState(data[i]);
    }

    const handleTextChange = (text, key) => {
        localData[key][1](text.target.value);
    }

    const handleAgeButton = (n) => {
        const newAge = localData.retirementAge[0] + n;
        localData.retirementAge[1](newAge);
        handleParameterChange();
    }

    // useEffect(() => {

    // }, [localData.retirementAge[0]])

    // modal is active bool
    const [modalActive, setModalActive] = useState(false);
    const [modalTitle, setModalTitle] = useState('Title');
    const [modalText, setModalText] = useState('body');

    // modal function that sets the modal title and body and sets the modal active to true
    const handleModal = (title, text) => {
        setModalTitle(title);
        setModalText(text);
        setModalActive(true);
    }

    return (


        <div className='flex flex-col h-full w-full text-center space-y-2 py-8'>
            {modalActive && <Modal title={modalTitle} text={modalText} setModalActive={setModalActive} />}

            <div className='flex w-full justify-center items-center flex-col'>
                <span>Your balance at time of retirement is:</span>
                <span className='flex justify-center items-center rounded p-2 text-4xl font-bold bg-gray-100'>{lumpSum.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
                <span>Your annual stipend after retirement is:</span>
                <span className='flex justify-center items-center rounded p-2 text-4xl font-bold bg-gray-100'>{stipend.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
                <span>Monthly, that's:</span>
                <span className='flex justify-center items-center rounded p-2 text-4xl font-bold bg-gray-100'>{(stipend / 12).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>

            </div>
            {/* <span className='text-xl font-bold'>Your annual stipend after retirement is ${lumpSum.toFixed(2)}</span> */}

            <div className='flex w-full justify-around'>
                <button className="bg-yellow-400 text-white rounded-sm p-2 font-bold" onClick={() => handleAgeButton(-1)}>
                    Retire one year earlier
                </button>
                <button className="bg-yellow-400 text-white rounded-sm p-2 font-bold" onClick={() => handleAgeButton(1)}>
                    Retire one year later
                </button>
            </div>


            <div>
                {Object.entries(localData).map(([key, entry]) => {
                    return (
                        <div key={key} className='flex items-center justify-end p-1 w-full font-bold odd:bg-gray-100'>
                            <div className='flex w-full items-center justify-between'>
                                <span className='flex h-full items-center text-left space-x-2'>
                                    <span>{key}</span>
                                    {(key in blurbs) ? <button className='flex justify-center items-center rounded-full bg-yellow-400 w-5 h-5' onClick={() => { handleModal(key, blurbs[key]) }}>?</button> : ''}
                                    :</span>
                                <input type="text" value={entry[0]} onChange={text => { handleTextChange(text, key) }} className='flex border p-2 rounded w-1/2'></input>
                            </div>

                            <button onClick={() => { handleParameterChange() }} className='p-2 bg-yellow-400 text-white rounded'>change</button>
                        </div>
                    )
                })}
            </div>


        </div>

    );
}

export default Results;