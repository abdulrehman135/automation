import os;
import sys;

os.system("git add .")
s = input("Commit Message: ")
os.system("git commit -m \"" + s + "\"")
os.system("git push origin HEAD")


