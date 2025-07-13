
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, Instagram, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const feedbackSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  feedback: z.string().min(10, "Feedback must be at least 10 characters.").max(1000),
});


export function FeedbackClientPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const feedbackForm = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, feedback: '' },
  });

  function onFeedbackSubmit(values: z.infer<typeof feedbackSchema>) {
    console.log("Feedback submitted:", values);
    toast({
      title: 'Feedback Sent!',
      description: 'Thank you for helping us improve!',
    });
    feedbackForm.reset();
    setRating(0);
  }
  
  return (
    <div className="mx-auto max-w-2xl space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Share Your Thoughts</CardTitle>
                <CardDescription>We'd love to hear what you think about Cipher IQ.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...feedbackForm}>
                    <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-6">
                        <FormField
                            control={feedbackForm.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How would you rate your experience?</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            {[1,2,3,4,5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        "h-8 w-8 cursor-pointer transition-colors",
                                                        rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
                                                    )}
                                                    onClick={() => {
                                                        setRating(star);
                                                        field.onChange(star);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={feedbackForm.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Feedback</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us what you liked or what could be better..." {...field} rows={5}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={feedbackForm.formState.isSubmitting}>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Feedback
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Contact Developer</CardTitle>
                <CardDescription>
                    Have a feature request or want to connect? Reach out on Instagram!
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild className="w-full">
                    <Link href="https://www.instagram.com/siddhant_hue" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-5 w-5" />
                        @siddhant_hue
                        <ArrowRight className="ml-auto h-5 w-5" />
                    </Link>
                 </Button>
            </CardContent>
        </Card>
    </div>
  );
}
