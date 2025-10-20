import { apiPayment } from "@/lib/apiClient"
import { CreatePaymentFormData } from "@/inference/UserRequestType"
export const PaymentApi={

 getPaymentIntent:(PaymentPros:CreatePaymentFormData)=>
    apiPayment.post("/Payment/create-intent", PaymentPros)

}