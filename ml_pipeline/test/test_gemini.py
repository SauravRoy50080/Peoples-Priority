from processing.gemini_processor import classify_complaint

com="I want a hospital in my village cause the road to other city hospital is broken"
result=classify_complaint(com)

print(result)