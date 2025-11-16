'use client'
import { useState } from "react"
import Image from "next/image"
import { loadStripe } from "@stripe/stripe-js";
import { stripeAppearance } from "@/lib/appearance";
import {
  Elements, PaymentElement, AddressElement,
  useStripe, useElements
} from "@stripe/react-stripe-js";
import { CreatePaymentFormData } from "@/inference/UserRequestType";
import { PaymentApi } from "@/api/payment";

type FormDataPros={
  name:string,
  setName:React.Dispatch<React.SetStateAction<string>>,
  email: string,
  setEmail:React.Dispatch<React.SetStateAction<string>>,
  amount:string,
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const Payment = () => {
  const [donateAmount, setAmount] = useState<string>("5")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [selected, setSelected] = useState<string>("")
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [addr, setAddr] = useState<any>(null);

  const handleSelectFixedAmount = (amount: string) => {
    setSelected("");
    setAmount(amount);
    setCustomAmount("");
  }
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "") {
      setCustomAmount("");
      return;
    }
    if (/^\d*\.?\d{0,2}$/.test(v)) {
      setCustomAmount(v)
    }
  }
  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // block "." as the very first character
    if (e.key === "." && customAmount === "") {
      e.preventDefault();
    }
  };
  const handleOnblur = () => {
    if (customAmount === "" || customAmount === "." || Number(customAmount) < 1) return;
    const n = Number(customAmount);
    setCustomAmount(n.toFixed(2));
  }
  const FinalAmount = selected === "custom" && (customAmount !== "" && customAmount !== "0") ? customAmount : donateAmount
  const NumberAmount = Number(FinalAmount).toFixed(2);
  return (
    <div className="flex flex-col xborder border-black flex-1 p-5 max-w-[400px] shadow-lg drop-shadow-md shadow-black/30">
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <button className="w-6 h-6 rounded-full bg-black text-gray-300 mr-3">1</button>
          <p className="text-2xl">Choose amount(AUD)</p>
        </div>
        <div className="grid grid-cols-[repeat(1, minmax(50px,100px))] gap-4">

          <div className="">
            <input type="radio" className="sr-only peer" id="amt-1" name="amount-selector" value="1" />
            <label
              className="border peer-checked:bg-amber-300 px-3 py-1 rounded-xl cursor-pointer transition font-bold"
              htmlFor="amt-1"
              onClick={() => handleSelectFixedAmount("1")}
            >$1</label></div>
          <div className="peer-checked:bg-amber-300">
            <input type="radio" className="sr-only peer" id="amt-5" name="amount-selector" value="5" defaultChecked />
            <label
              className="border peer-checked:bg-amber-300 px-3 py-1 rounded-xl cursor-pointer transition font-bold"
              htmlFor="amt-5"
              onClick={() => handleSelectFixedAmount("5")}
            >$5</label></div>
          <div className="peer-checked:bg-amber-300">
            <input type="radio" className="sr-only peer" id="amt-10" name="amount-selector" value="10" />
            <label
              className="border peer-checked:bg-amber-300 px-3 py-1 rounded-xl cursor-pointer transition font-bold"
              htmlFor="amt-10"
              onClick={() => handleSelectFixedAmount("10")}
            >$10</label></div>
          <div className="peer-checked:bg-amber-300">
            <input type="radio" className="sr-only peer" id="amt-20" name="amount-selector" value="20" />
            <label
              className="border peer-checked:bg-amber-300 px-3 py-1 rounded-xl cursor-pointer transition font-bold"
              htmlFor="amt-20"
              onClick={() => handleSelectFixedAmount("20")}>$20</label></div>
          <div className="peer-checked:bg-amber-300 col-span-3 col-start-2">
            <input
              type="radio"
              className="sr-only peer"
              id="amt-custom"
              name="amount-selector"
              value="20"
              checked={selected === "custom"}
              onChange={() => setSelected("custom")}
            />
            <label className="border peer-checked:bg-amber-300 px-3 py-1 rounded-xl cursor-pointer transition font-bold"
              htmlFor="amt-custom">
              <span>Custom:$</span>
              <input type="text"
                id="amt-custom-input"
                className="ml-1 h-6 bg-white border-gray-300 border max-w-[50px] rounded-lg focus:outline-amber-400 px-1"
                onFocus={() => setSelected("custom")}
                onChange={(e) => handleOnChange(e)}
                value={selected === "custom" ? customAmount : ""}
                onKeyDown={handleCustomKeyDown}
                onBlur={handleOnblur}
              />
            </label>
          </div>
        </div>
        {selected === "custom" && Number(customAmount) < 1 && <p className="text-red-500 mt-2">Please select an amount greater than $1</p>}
        <div className="flex items-center mt-3 mb-3 w-full"><span className="flex-grow border-t-2 border-black text-center font-bold text-2xl">Total:${NumberAmount}</span></div>
      </div>
      { /*
      <div className="flex flex-col">
      <div className="flex items-center">
          <button className="w-6 h-6 rounded-full bg-black text-gray-300 ">2</button>
          <p>Choose payment method</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-bold">Credit card</p>
          <Image src="/cc_logos.png" alt="payment" width={300} height={30}></Image>
        </div>
      </div> */}
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <button className="w-6 h-6 rounded-full bg-black text-gray-300 mr-3">2</button>
          <p className="text-2xl">Enter payment information</p>
        </div>
        {/* using stripe*/}
        <Elements
          stripe={stripePromise}
          // deferred mount: no clientSecret yet
          options={{ mode: "payment", amount: Math.max(1, Number(NumberAmount) * 100), currency: "aud", appearance: stripeAppearance }}
        >
          <Form name={name} setName={setName} email={email} setEmail={setEmail}  amount={NumberAmount} />
        </Elements>
      </div>


    </div>
  )
}
const Form = ({ name, setName, email, setEmail, amount }: FormDataPros) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!email || ! name || !amount) return;
    if (!stripe || !elements) return;
    try{
      const { error: submitError } = await elements.submit();
  if (submitError) {
    // e.g. “Enter a card number”, “CVC required”, etc.
    // Show submitError.message and return
    return;
  }

      const res:any= await PaymentApi.getPaymentIntent({email:email, firstName:name, amountAud:amount})
      const clientSecret = res.data.clientSecret;
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // 支付成功后跳转的页面
          return_url: `${window.location.origin}/donate/success`,
        },
      });

    }catch(err:any){

    }

  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* your own non-sensitive fields */}
      <label className="block text-[#374151] mb-[3px] font-bold text-[14.88px] leading-[17.112px]" htmlFor="email">Email<span></span></label>
      <input id="email"
        name="email"
        className="border-1 border-[#9ca3af] rounded p-[9px] mb-[15px] w-full text-[20px] leading-[23px] focus:border-[#111827] focus:shadow-[0_0_0_3px_rgba(17,24,39,.15)] focus:outline-none" 
        placeholder="" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} required />

      {/* Stripe-hosted fields */}
      <AddressElement options={{ mode: "billing", display: { name: "split" } }} 
      onChange={(ev) =>{
        const { value } = ev;
        const firstName = value?.firstName ?? "";
        setName(firstName);
      }
      } />
      <div className="flex items-center mb-3">
        <button className="w-6 h-6 rounded-full bg-black text-gray-300 mr-3">3</button>
        <p className="text-2xl">Choose payment method</p>
      </div>
      <PaymentElement />  {/* card + CVC + wallets as applicable */}

      <button disabled={!stripe || loading} 
              className="px-4 py-2 rounded bg-emerald-600 text-white w-full">
        Donate
      </button>
    </form>
  )
}
export default Payment

